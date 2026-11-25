import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "basra_admin_session";
const SESSION_LENGTH_SECONDS = 8 * 60 * 60;

function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function hasValidSession(request: Request): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) return false;

  const expected = createHmac("sha256", secret).update(expiresAt).digest();
  const actual = Buffer.from(signature, "base64url");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function sessionCookie(request: Request, value: string, maxAge = SESSION_LENGTH_SECONDS): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}

export default async (request: Request): Promise<Response> => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 32 || !password) {
    return jsonResponse({
      error: "أضف ADMIN_PASSWORD وADMIN_SESSION_SECRET بطول 32 حرفًا على الأقل في إعدادات Netlify.",
    }, 503);
  }

  if (request.method === "GET") {
    return new Response(null, { status: hasValidSession(request) ? 204 : 401 });
  }

  if (request.method === "DELETE") {
    return new Response(null, {
      status: 204,
      headers: { "Set-Cookie": sessionCookie(request, "", 0) },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "طريقة الطلب غير مدعومة." }, 405);
  }

  try {
    const body: unknown = await request.json();
    const suppliedPassword =
      body && typeof body === "object" && "password" in body && typeof body.password === "string"
        ? body.password
        : "";
    const expected = Buffer.from(password);
    const supplied = Buffer.from(suppliedPassword);
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
      return jsonResponse({ error: "كلمة المرور غير صحيحة." }, 401);
    }

    const expiresAt = String(Date.now() + SESSION_LENGTH_SECONDS * 1000);
    const signature = createHmac("sha256", secret).update(expiresAt).digest("base64url");
    return jsonResponse({ authenticated: true }, 200, {
      "Set-Cookie": sessionCookie(request, `${expiresAt}.${signature}`),
    });
  } catch (error) {
    console.error("Could not authenticate the administrator.", error);
    return jsonResponse({ error: "تعذر إكمال تسجيل الدخول." }, 400);
  }
};
