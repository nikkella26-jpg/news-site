/**
 * Simple client-side cache utility with TTL (Time To Live).
 */
export const clientCache = {
    set: (key: string, data: any, ttlHours: number = 3) => {
        if (typeof window === "undefined") return;
        const expiry = Date.now() + ttlHours * 60 * 60 * 1000;
        localStorage.setItem(key, JSON.stringify({ data, expiry }));
    },

    get: (key: string) => {
        if (typeof window === "undefined") return null;
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.data;
    },
};
