/** @format */

import { UserProfile } from "../types";

// PRODUCTION SETUP:
// 1. If running locally, it uses http://localhost:8080/api
// 2. If deployed, set VITE_API_URL in your environment variables.
// NOTE: We use import.meta.env.VITE_API_URL for Vite compatibility.

const getApiUrl = () => {
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_API_URL
  ) {
    return (import.meta as any).env.VITE_API_URL;
  }
  return false;
};

const API_URL = getApiUrl();

console.log("🔗 API Connected to:", API_URL);

export const api = {
  auth: {
    signup: async (userData: any): Promise<UserProfile> => {
      try {
        const res = await fetch(`${API_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");

        localStorage.setItem("token", data.token);
        return data.user;
      } catch (error) {
        console.error("Signup Error:", error);
        throw new Error(
          "Connection failed. Is the Backend Server (localhost:8080) running?",
        );
      }
    },

    login: async (credentials: any): Promise<UserProfile> => {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        return data.user;
      } catch (error) {
        console.error("Login Error:", error);
        throw new Error(
          "Network Error: Could not connect to backend at " +
            API_URL +
            ". Ensure server is running.",
        );
      }
    },

    getMe: async (): Promise<UserProfile> => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Session expired");
        return data;
      } catch (error) {
        console.error("Session Error:", error);
        throw error;
      }
    },
  },

  user: {
    update: async (
      userId: string,
      updates: Partial<UserProfile>,
    ): Promise<UserProfile> => {
      const res = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updates }),
      });
      const data = await res.json();
      return data;
    },

    getLeaderboard: async (): Promise<UserProfile[]> => {
      try {
        const res = await fetch(`${API_URL}/leaderboard`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.error("Failed to fetch leaderboard", e);
        return [];
      }
    },

    recordActivity: async (user: UserProfile): Promise<UserProfile> => {
      const today = new Date().toISOString().split("T")[0];
      if (user.lastActiveDate === today) return user;

      const lastDate = new Date(user.lastActiveDate);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = user.streak;
      if (diffDays === 1) newStreak += 1;
      else if (diffDays > 1) newStreak = 1;

      return await api.user.update(user._id, {
        streak: newStreak,
        lastActiveDate: today,
        totalLearningDays: (user.totalLearningDays || 0) + 1,
      });
    },
  },
};
