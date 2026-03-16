const VPS_API_URL = process.env.VPS_API_URL || "http://45.82.72.207:3847";
const VPS_API_KEY = process.env.VPS_API_KEY || "campus_crm_2026_secure_key";

export async function fetchVPS(endpoint: string, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${VPS_API_URL}${endpoint}`, {
      headers: { "X-API-Key": VPS_API_KEY },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`VPS API error: ${res.status}`);
    return res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}
