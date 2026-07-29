// Centralized configuration.
// In Vite, env vars exposed to the client MUST be prefixed with VITE_
// and are read via import.meta.env instead of process.env.
//
// Set VITE_API_URL in a .env file locally, and as a Project Environment
// Variable in Vercel for production (e.g. https://your-backend.onrender.com)

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
