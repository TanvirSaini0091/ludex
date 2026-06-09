const API_BASE = import.meta.env.VITE_API_URL || '';

export const steamApi = {
  getRecentGames: async () => {
    const res = await fetch(`${API_BASE}/api/steam/recent`);
    if (!res.ok) throw new Error("Failed to fetch recent games");
    return res.json();
  },
  getLibraryStats: async () => {
    const res = await fetch(`${API_BASE}/api/steam/library`);
    if (!res.ok) throw new Error("Failed to fetch library stats");
    return res.json();
  }
};
