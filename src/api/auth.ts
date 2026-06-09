const API_BASE = import.meta.env.VITE_API_URL || '';

export const authApi = {
  getMe: async () => {
    const response = await fetch(`${API_BASE}/api/auth/me`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  },
  getSteamLoginUrl: () => `${API_BASE}/api/auth/steam`,
  getLogoutUrl: () => `${API_BASE}/api/auth/logout`,
};
