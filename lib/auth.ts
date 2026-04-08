const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return false;
  return username.toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD;
}
