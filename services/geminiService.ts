/** @format */

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GENERATION_TEMPLATE, SYSTEM_INSTRUCTION } from "../constants";
import { QuizData } from "../types";

// --- CACHING & RETRY UTILS ---

const CACHE_PREFIX = "tutorgram_cache_";

const getFromCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    // Valid for 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
};

const saveToCache = (key: string, data: any) => {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (e) {
    console.warn("LocalStorage full, clearing old cache...");
    localStorage.clear(); // Nuclear option for demo, better to use LRU in prod
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper to handle 429 errors automatically
const callWithRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 2000,
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Check for Quota Exceeded (429) or Service Unavailable (503)
    const msg = error?.message || JSON.stringify(error);
    if (
      (msg.includes("429") || msg.includes("Quota") || msg.includes("503")) &&
      retries > 0
    ) {
      console.warn(
        `Quota hit! Retrying in ${delay / 1000}s... (${retries} left)`,
      );
      await wait(delay);
      return callWithRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

// --- API FUNCTIONS ---

export const regenerateTopicContent = async (
  category: string,
  chapter: string,
  topicHeading: string,
  originalContent: string,
  userPrompt: string,
): Promise<string> => {
  const cacheKey = `content_${topicHeading}_${userPrompt}`.replace(/\s+/g, "_");
  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = GENERATION_TEMPLATE.replace("{{category}}", category)
      .replace("{{chapter}}", chapter)
      .replace("{{topic_heading}}", topicHeading)
      .replace("{{original_content}}", originalContent)
      .replace("{{user_prompt}}", userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text || "Failed to generate content.";
    saveToCache(cacheKey, text);
    return text;
  });
};

export const generateTopicAudio = async (
  text: string,
): Promise<string | null> => {
  // Audio is large, usually we don't cache base64 in localStorage heavily,
  // but for short clips it's okay to avoid 429 on replay.
  const cacheKey = `audio_${text.substring(0, 20)}`;
  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) saveToCache(cacheKey, base64Audio);
    return base64Audio || null;
  });
};

export const generateChapterQuiz = async (
  chapterTitle: string,
  contextData: string,
): Promise<QuizData | null> => {
  return generateQuizInternal(
    `Full Module: ${chapterTitle}`,
    contextData,
    10,
    `quiz_chap_${chapterTitle}`,
  );
};

export const generateTopicQuiz = async (
  topicTitle: string,
  content: string,
): Promise<QuizData | null> => {
  return generateQuizInternal(
    `Topic: ${topicTitle}`,
    content,
    5,
    `quiz_topic_${topicTitle}`,
  );
};

const generateQuizInternal = async (
  titleContext: string,
  contentContext: string,
  numQuestions: number,
  cacheKey: string,
): Promise<QuizData | null> => {
  // Check Cache First
  const cached = getFromCache<QuizData>(cacheKey);
  if (cached) {
    console.log("Serving Quiz from Cache");
    return cached;
  }

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const safeContext = contentContext.substring(0, 15000);

    const prompt = `
        Generate a quiz for: "${titleContext}".

        Source Material:
        ${safeContext}

        Create exactly ${numQuestions} Multiple Choice Questions (MCQs).
        Difficulty: Intermediate.

        OUTPUT MUST BE STRICT RAW JSON ONLY. NO MARKDOWN.
        Structure:
        {
          "questions": [
            {
              "id": 1,
              "question": "Question text",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswerIndex": 0, // 0-3 integer
              "explanation": "Why this is correct"
            }
          ]
        }
        `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    const result = {
      chapterId: cacheKey,
      questions: parsed.questions,
    };

    saveToCache(cacheKey, result);
    return result;
  });
};

export const generateTopicVideo = async (
  topicTitle: string,
): Promise<string | null> => {
  // Video cannot be cached easily as URLs expire, so we just use Retry logic
  const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

  return callWithRetry(async () => {
    let operation = await videoAi.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: `Cinematic 3D abstract visualization of computer science concept: ${topicTitle}. Glowing nodes, data streams, digital network, futuristic education style, 4k, high quality.`,
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: "16:9",
      },
    });

    while (!operation.done) {
      await wait(5000);
      operation = await videoAi.operations.getVideosOperation({
        operation: operation,
      });
    }

    const video = operation.response?.generatedVideos?.[0]?.video;
    if (video?.uri) {
      return `${video.uri}&key=${process.env.API_KEY}`;
    }
    return null;
  }, 1); // Less retries for video as it is heavy
};

export const generateMotivationalQuote = async (): Promise<string | null> => {
  // Cache quotes aggressively (12 hours)
  const cacheKey = "daily_quote";
  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents:
        "Generate a single, short, high-energy motivational quote for a programmer or student. Maximum 8 words. Uppercase. No quotes.",
      config: { temperature: 1.0 },
    });
    const text = response.text ? response.text.trim() : null;
    if (text) saveToCache(cacheKey, text);
    return text;
  });
};
