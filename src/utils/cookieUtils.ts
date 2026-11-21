export const AUTH_COOKIE_NAME = 'homies_token';

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
