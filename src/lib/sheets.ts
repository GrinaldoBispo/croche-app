const BASE = process.env.APPS_SCRIPT_URL || "";

export async function appsScriptGet(params: Record<string, string>) {
  if (!BASE) throw new Error("APPS_SCRIPT_URL nao configurada");
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url.toString(), { cache: "no-store" });
  return r.json();
}

export async function appsScriptPost(body: unknown) {
  if (!BASE) throw new Error("APPS_SCRIPT_URL nao configurada");
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}
