/** @format */

import React, { useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Github,
  Linkedin,
  Play,
  AlertCircle,
} from "lucide-react";
import { UserProfile } from "../types";
import { api } from "../services/api";

interface Props {
  onLogin: (user: UserProfile) => void;
}

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // const handleGuestLogin = () => {
  //   // Create fake history for the last few days to demo the graph
  //   const today = new Date();
  //   const yesterday = new Date(today);
  //   yesterday.setDate(yesterday.getDate() - 1);
  //   const dayBefore = new Date(today);
  //   dayBefore.setDate(dayBefore.getDate() - 2);
  //   const fourDaysAgo = new Date(today);
  //   fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  //   const guestUser: UserProfile = {
  //     _id: "guest-" + Date.now(),
  //     name: "Guest Student",
  //     email: "guest@tutorgram.dev",
  //     role: "Student",
  //     avatarUrl:
  //       "https://api.dicebear.com/7.x/notionists/svg?seed=Guest&backgroundColor=e5e7eb",
  //     joinedDate: new Date().toISOString(),
  //     xp: 1250,
  //     level: 5,
  //     streak: 3,
  //     longestStreak: 3,
  //     totalLearningDays: 14,
  //     // Use getLocalDateString to ensure graph lights up correctly
  //     lastActiveDate: getLocalDateString(today),
  //     activityHistory: [
  //       getLocalDateString(fourDaysAgo),
  //       getLocalDateString(dayBefore),
  //       getLocalDateString(yesterday),
  //       getLocalDateString(today),
  //     ],
  //     completedTopics: ["c-basics", "c-control"],
  //     quizScores: { "c-basics": 5 },
  //   };
  //   onLogin(guestUser);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const newUser = await api.auth.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.name}&backgroundColor=ABFA00`,
        });
        onLogin(newUser);
      } else {
        const user = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });
        onLogin(user);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(
        (err as Error).message ||
          "Connection failed. Please use Guest Mode if server is down.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(
      `Backend integration required for ${provider} Login. See BACKEND_GUIDE.md`,
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-dots">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Left Side: Brand & Value */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block w-24 h-24 bg-acid border-4 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl flex items-center justify-center mb-8 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <GraduationCap size={48} className="text-black" />
          </div>
          <h1 className="text-6xl font-black text-black dark:text-white tracking-tighter mb-4 leading-none">
            MASTER
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-acid-dark to-acid">
              COMPUTER
            </span>
            <br />
            SCIENCE.
          </h1>
          <p className="text-xl font-bold text-gray-500 dark:text-gray-400 max-w-md mb-8">
            The AI-powered learning platform that adapts to your unique learning
            style.
          </p>

          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex"
                  alt=""
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah"
                  alt=""
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Mike"
                  alt=""
                />
              </div>
              <span className="font-bold text-sm text-gray-600 dark:text-gray-400">
                +1,200 Students Learning
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md bg-white dark:bg-black border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_#000] dark:shadow-[12px_12px_0px_0px_#fff] rounded-3xl p-8 relative overflow-hidden">
          {/* Social Logins */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_#000] transition-all active:translate-y-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialLogin("GitHub")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#24292e] border-2 border-black rounded-xl font-bold text-white hover:bg-black hover:shadow-[4px_4px_0px_0px_#000] transition-all active:translate-y-1">
                <Github size={20} /> GitHub
              </button>
              <button
                onClick={() => handleSocialLogin("LinkedIn")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0077b5] border-2 border-black rounded-xl font-bold text-white hover:brightness-110 hover:shadow-[4px_4px_0px_0px_#000] transition-all active:translate-y-1">
                <Linkedin size={20} /> LinkedIn
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <hr className="w-full border-black dark:border-white opacity-20" />
            <span className="absolute bg-white dark:bg-black px-3 text-xs font-black uppercase tracking-widest text-gray-400">
              Or with Email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="neo-label">Full Name</label>
                <input
                  className="neo-input"
                  type="text"
                  name="name"
                  placeholder="e.g. Rohit Patel"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="neo-label">Email Address</label>
              <input
                className="neo-input"
                type="email"
                name="email"
                placeholder="e.g. rohit@tutorgram.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="neo-label">Password</label>
              <input
                className="neo-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-600 dark:text-red-400 font-bold text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="neo-btn w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-wait">
              {isLoading
                ? "Processing..."
                : mode === "signup"
                  ? "Create Account"
                  : "Login Now"}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* <div className="my-4 text-center">
            <button
              onClick={handleGuestLogin}
              className="text-sm font-black uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors">
              <Play size={14} className="fill-current" /> Continue as Guest
            </button>
          </div> */}

          <div className="text-center pt-4 border-t-2 border-dashed border-gray-200 dark:border-zinc-800">
            <p className="text-sm font-bold text-gray-500">
              {mode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setError("");
                }}
                className="ml-2 text-black dark:text-white underline decoration-2 underline-offset-2 hover:text-acid transition-colors uppercase tracking-wide">
                {mode === "signup" ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
