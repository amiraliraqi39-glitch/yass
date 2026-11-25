import { getStore } from "@netlify/blobs";
import { createHmac, timingSafeEqual } from "node:crypto";

const storageContext = process.env.CONTEXT === "production" ? "production" : "preview";
const store = getStore(`basra-writers-union-${storageContext}`);
const MAX_STATE_BYTES = 4_000_000;
const SESSION_COOKIE = "basra_admin_session";

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
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function redactMemberCredentials(state: unknown): unknown {
  if (!state || typeof state !== "object" || Array.isArray(state)) return state;
  const data = state as Record<string, unknown>;
  const redact = (members: unknown): unknown => Array.isArray(members)
    ? members.map((member) => {
      if (!member || typeof member !== "object" || Array.isArray(member)) return member;
      const publicMember = { ...(member as Record<string, unknown>) };
      delete publicMember.username;
      delete publicMember.accessCode;
      return publicMember;
    })
    : members;

  return {
    ...data,
    writers: redact(data.writers),
    board: redact(data.board),
    submissions: [],
  };
}

export default async (request: Request): Promise<Response> => {
  if (request.method === "GET") {
    try {
      const state = await store.get("site-state", { type: "json" });
      return jsonResponse(state ? (hasValidSession(request) ? state : redactMemberCredentials(state)) : null);
    } catch (error) {
      console.error("Could not read the shared site state.", error);
      return jsonResponse({ error: "تعذر تحميل بيانات الموقع المحفوظة." }, 500);
    }
  }

  if (request.method !== "PUT") {
    return jsonResponse({ error: "طريقة الطلب غير مدعومة." }, 405);
  }

  if (!hasValidSession(request)) {
    return jsonResponse({ error: "يلزم تسجيل الدخول لحفظ التغييرات." }, 401);
  }

  try {
    const body = await request.text();
    if (Buffer.byteLength(body, "utf8") > MAX_STATE_BYTES) {
      return jsonResponse({ error: "حجم البيانات كبير جدًا. قلّل حجم الصور المرفوعة." }, 413);
    }

    const state: unknown = JSON.parse(body);
    if (!state || typeof state !== "object" || Array.isArray(state)) {
      return jsonResponse({ error: "صيغة بيانات الموقع غير صحيحة." }, 400);
    }

    await store.setJSON("site-state", state);
    return jsonResponse({ saved: true });
  } catch (error) {
    console.error("Could not save the shared site state.", error);
    return jsonResponse({ error: "تعذر حفظ التغييرات في التخزين المشترك." }, 500);
  }
};
