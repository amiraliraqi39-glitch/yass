import { getStore } from "@netlify/blobs";

const storageContext = process.env.CONTEXT === "production" ? "production" : "preview";
const store = getStore(`basra-writers-union-${storageContext}`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
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

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "طريقة الطلب غير مدعومة." }, 405);
  }

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.username !== "string" || typeof body.accessCode !== "string") {
      return jsonResponse({ error: "اسم المستخدم أو الرمز غير صحيح." }, 401);
    }
    const username = body.username.trim();
    const accessCode = body.accessCode.trim();

    const state = await store.get("site-state", { type: "json" });
    if (!isRecord(state)) return jsonResponse({ error: "اسم المستخدم أو الرمز غير صحيح." }, 401);

    const members = [
      ...(Array.isArray(state.writers) ? state.writers.map((member) => ({ member, role: "writer" as const })) : []),
      ...(Array.isArray(state.board) ? state.board.map((member) => ({ member, role: "board" as const })) : []),
    ];
    const match = members.find(({ member }) =>
      isRecord(member)
      && member.username === username
      && member.accessCode === accessCode
    );
    if (!match || !isRecord(match.member) || typeof match.member.id !== "string" || typeof match.member.name !== "string") {
      return jsonResponse({ error: "اسم المستخدم أو الرمز غير صحيح." }, 401);
    }

    return jsonResponse({
      member: { id: match.member.id, name: match.member.name, role: match.role },
    });
  } catch (error) {
    console.error("Could not authenticate a member.", error);
    return jsonResponse({ error: "تعذر إكمال تسجيل الدخول." }, 500);
  }
};
