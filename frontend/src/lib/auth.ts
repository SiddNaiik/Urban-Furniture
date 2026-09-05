export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (match) return match[2];
  return localStorage.getItem('access_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
  // Set cookie for 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `access_token=${token}; expires=${expires}; path=/; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
