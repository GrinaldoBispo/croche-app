const BASE = process.env.APPS_SCRIPT_URL || "";

async function lerJson(r: Response) {
  const texto = await r.text();
  const t = texto.trimStart();
  if (t.startsWith("<")) throw new Error("Apps Script retornou HTML (redeploy do /exec pendente?)");
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error("resposta inválida do Apps Script");
  }
}

export async function appsScriptGet(params: Record<string, string>) {
  if (!BASE) throw new Error("APPS_SCRIPT_URL nao configurada");
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url.toString(), { cache: "no-store" });
  return lerJson(r);
}

export async function appsScriptPost(body: unknown) {
  if (!BASE) throw new Error("APPS_SCRIPT_URL nao configurada");
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return lerJson(r);
}
