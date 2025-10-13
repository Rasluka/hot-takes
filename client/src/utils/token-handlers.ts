const tokenName = process.env.VITE_LOCAL_STORAGE_TOKEN_KEY || "authToken";

export const setAuthenticationToken = (token: string): void => {
  localStorage.setItem(tokenName, token);
};

export const getAuthenticationToken = (): string | null => {
  return localStorage.getItem(tokenName);
};

export const removeAuthenticationToken = (): void => {
  localStorage.removeItem(tokenName);
};
