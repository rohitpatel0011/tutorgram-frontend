/** @format */

import React, { useState } from "react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { UserProfile } from "../types";
import { api } from "../services/api";

interface Props {
  onLogin: (user: UserProfile) => void;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Centered Form Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-acid border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] rounded-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <GraduationCap size={40} className="text-black" />
          </div>
          <h1 className="text-5xl font-black text-black dark:text-white tracking-tight mb-2">
            TUTORGRAM
          </h1>
          <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            AI Learning Platform
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] rounded-2xl p-8 relative">
          {/* Toggle Mode */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-wider border-2 rounded-lg transition-all
                    ${
                      mode === "signup"
                        ? "bg-acid border-black text-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]"
                        : "bg-white dark:bg-black border-black dark:border-white text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
                    }`}>
              Sign Up
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 font-black text-sm uppercase tracking-wider border-2 rounded-lg transition-all
                    ${
                      mode === "login"
                        ? "bg-acid border-black text-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] translate-x-[-2px] translate-y-[-2px]"
                        : "bg-white dark:bg-black border-black dark:border-white text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
                    }`}>
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "signup" && (
              <div>
                <label className="neo-label">Full Name</label>
                <input
                  className="neo-input"
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
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
                placeholder="e.g. john@example.com"
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
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-600 dark:text-red-400 font-bold text-xs rounded-lg flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div className="flex flex-col">
                  <span>{error}</span>
                  <span className="font-normal opacity-70 mt-1">
                    Free servers take 1-2 mins to wake up.
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="neo-btn w-full justify-center mt-2">
              {isLoading
                ? "Connecting..."
                : mode === "signup"
                  ? "Create Account"
                  : "Access Dashboard"}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
