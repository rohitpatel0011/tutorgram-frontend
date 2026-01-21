/** @format */

export enum ContentType {
  Category = "Category",
  Chapter = "Chapter",
  Topic = "Topic",
}

// MongoDB User Schema Interface
export interface UserProfile {
  _id: string; // MongoDB ObjectId format
  name: string;
  email: string;
  token?: string; // JWT Token
  role: "Student" | "Pro" | "Educator";
  avatarUrl: string;
  joinedDate: string;
  xp: number;
  level: number;

  // Streak & Activity Stats
  streak: number;
  longestStreak: number;
  totalLearningDays: number;
  lastActiveDate: string; // ISO Date string
  activityHistory: string[]; // Array of ISO Date strings (YYYY-MM-DD) for graph

  // Progress Data (Now part of User Object in Real DB)
  completedTopics?: string[];
  quizScores?: Record<string, number>;
}

export interface Topic {
  id: string;
  title: string;
  content: string; // Base content
}

export interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Category {
  id: string;
  title: string;
  group: string; // New field for Parent Grouping (e.g., "Programming Languages")
  chapters: Chapter[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: "read" | "quiz" | "regenerate";
  targetId: string; // ID of topic or chapter
  dueDate?: string;
}

export interface AIOverride {
  topicId: string;
  content: string;
  prompt: string;
  timestamp: number;
}

// Progress Schema Interface (Client State)
export interface UserState {
  userId: string;
  completedTasks: string[];
  completedTopics: string[];
  aiOverrides: Record<string, AIOverride>;
  quizScores: Record<string, number>;
}

// AI Quiz Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  chapterId: string;
  questions: QuizQuestion[];
}
