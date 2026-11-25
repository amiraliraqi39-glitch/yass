import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const SESSION_COOKIE = "basra_admin_session";
const SESSION_LENGTH_SECONDS = 8 * 60 * 60;
const PASSWORD_HASH_KEY = "admin-password";
const MAX_PASSWORD_LENGTH = 128;
const storageContext = process.env.CONTEXT === "production" ? "production" : "preview";
const store = getStore(`basra-writers-union-${storageContext}`);

interface PasswordRecord {
  salt: string;
  hash: string;
}

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
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret || secret.length < 32) return false;

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

function isPasswordRecord(value: unknown): value is PasswordRecord {
  return Boolean(
    value
    && typeof value === "object"
    && "salt" in value
    && typeof value.salt === "string"
    && "hash" in value
    && typeof value.hash === "string"
  );
}

function verifyPassword(password: string, record: PasswordRecord): boolean {
  const expected = Buffer.from(record.hash, "base64url");
  const actual = scryptSync(password, Buffer.from(record.salt, "base64url"), 64);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function matchesBootstrapPassword(password: string, expectedPassword: string): boolean {
  const expected = Buffer.from(expectedPassword);
  const supplied = Buffer.from(password);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function sessionCookie(request: Request, value: string, maxAge = SESSION_LENGTH_SECONDS): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}

export default async (request: Request): Promise<Response> => {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || password;
  if (!password || !secret || secret.length < 32) {
    return jsonResponse({
      error: "أضف ADMIN_PASSWORD. يجب أن يكون ADMIN_SESSION_SECRET بطول 32 حرفًا، أو اجعل كلمة المرور نفسها بهذا الطول.",
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

  if (request.method !== "POST" && request.method !== "PUT") {
    return jsonResponse({ error: "طريقة الطلب غير مدعومة." }, 405);
  }

  if (request.method === "PUT" && !hasValidSession(request)) {
    return jsonResponse({ error: "انتهت جلسة المشرف. سجّل الدخول مجددًا." }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "بيانات الطلب غير صحيحة." }, 400);
  }

  if (request.method === "PUT") {
    const currentPassword =
      body && typeof body === "object" && "currentPassword" in body && typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";
    const newPassword =
      body && typeof body === "object" && "newPassword" in body && typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (newPassword.length < 12 || newPassword.length > MAX_PASSWORD_LENGTH) {
      return jsonResponse({ error: "يجب أن تتكون كلمة المرور الجديدة من 12 إلى 128 حرفًا." }, 400);
    }
    if (currentPassword.length > MAX_PASSWORD_LENGTH) {
      return jsonResponse({ error: "كلمة المرور الحالية غير صحيحة." }, 401);
    }

    try {
      const savedPassword: unknown = await store.get(PASSWORD_HASH_KEY, { type: "json" });
      const currentPasswordIsValid = isPasswordRecord(savedPassword)
        ? verifyPassword(currentPassword, savedPassword)
        : matchesBootstrapPassword(currentPassword, password);
      if (!currentPasswordIsValid) {
        return jsonResponse({ error: "كلمة المرور الحالية غير صحيحة." }, 401);
      }

      const salt = randomBytes(16);
      const record: PasswordRecord = {
        salt: salt.toString("base64url"),
        hash: scryptSync(newPassword, salt, 64).toString("base64url"),
      };
      await store.setJSON(PASSWORD_HASH_KEY, record);
      return jsonResponse({ changed: true });
    } catch (error) {
      console.error("Could not change the administrator password.", error);
      return jsonResponse({ error: "تعذر حفظ كلمة المرور الجديدة." }, 500);
    }
  }

  const suppliedPassword =
    body && typeof body === "object" && "password" in body && typeof body.password === "string"
      ? body.password
      : "";
  if (suppliedPassword.length > MAX_PASSWORD_LENGTH) {
    return jsonResponse({ error: "كلمة المرور غير صحيحة." }, 401);
  }

  try {
    const savedPassword: unknown = await store.get(PASSWORD_HASH_KEY, { type: "json" });
    const authenticated = isPasswordRecord(savedPassword)
      ? verifyPassword(suppliedPassword, savedPassword)
      : matchesBootstrapPassword(suppliedPassword, password);
    if (!authenticated) {
      return jsonResponse({ error: "كلمة المرور غير صحيحة." }, 401);
    }

    const expiresAt = String(Date.now() + SESSION_LENGTH_SECONDS * 1000);
    const signature = createHmac("sha256", secret).update(expiresAt).digest("base64url");
    return jsonResponse({ authenticated: true }, 200, {
      "Set-Cookie": sessionCookie(request, `${expiresAt}.${signature}`),
    });
  } catch (error) {
    console.error("Could not authenticate the administrator.", error);
    return jsonResponse({ error: "تعذر إكمال تسجيل الدخول." }, 500);
  }
};
