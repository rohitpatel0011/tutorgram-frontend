/** @format */

import { UserProfile } from "../types";

// Use process.env for API URL
const API_URL = process.env.VITE_API_URL || "http://localhost:8080/api";

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
          "Connection failed. If using Render Free Tier, the server might be waking up. Please wait 1 minute and try again.",
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
          "Connection failed. If using Render Free Tier, the server might be waking up. Please wait 1 minute and try again.",
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
      // Guest mode local update
      if (userId === "guest-123") {
        return { ...updates } as UserProfile;
      }

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
        return [];
      }
    },

    recordActivity: async (user: UserProfile): Promise<UserProfile> => {
      if (user._id === "guest-123") {
        return { ...user, streak: user.streak + 1 };
      }

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
