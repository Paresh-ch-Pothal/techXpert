import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"; // match however you've set this elsewhere

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach auth-token on every request, read fresh from localStorage each time
// (so a fresh login mid-session is picked up without recreating the instance)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // adjust key name if you store it differently
    if (token) {
        config.headers["auth-token"] = token;
    }
    return config;
});

// Optional: centralize handling of expired/invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Auth token invalid or expired.");
            // e.g. localStorage.removeItem("token"); window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;