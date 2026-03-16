const USERS: Record<string, string> = {
  campos: "administrador",
};

export function validateCredentials(username: string, password: string): boolean {
  const expected = USERS[username.toLowerCase()];
  return expected !== undefined && expected === password;
}
