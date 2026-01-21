/** @format */

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GENERATION_TEMPLATE, SYSTEM_INSTRUCTION } from "../constants";
import { QuizData } from "../types";

export const regenerateTopicContent = async (
  category: string,
  chapter: string,
  topicHeading: string,
  originalContent: string,
  userPrompt: string,
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = GENERATION_TEMPLATE.replace("{{category}}", category)
    .replace("{{chapter}}", chapter)
    .replace("{{topic_heading}}", topicHeading)
    .replace("{{original_content}}", originalContent)
    .replace("{{user_prompt}}", userPrompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${(error as Error).message}`;
  }
};

export const generateTopicAudio = async (
  text: string,
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
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
    return base64Audio || null;
  } catch (error) {
    console.error("Audio Generation Error:", error);
    return null;
  }
};

export const generateChapterQuiz = async (
  chapterTitle: string,
  contextData: string,
): Promise<QuizData | null> => {
  // Module quizzes get 10 questions
  return generateQuizInternal(`Full Module: ${chapterTitle}`, contextData, 10);
};

export const generateTopicQuiz = async (
  topicTitle: string,
  content: string,
): Promise<QuizData | null> => {
  // Topic quizzes get 5 questions
  return generateQuizInternal(`Topic: ${topicTitle}`, content, 5);
};

// Shared helper
const generateQuizInternal = async (
  titleContext: string,
  contentContext: string,
  numQuestions: number,
): Promise<QuizData | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Trim context to avoid token limits
  const safeContext = contentContext.substring(0, 15000);

  const prompt = `
    Generate a quiz for: "${titleContext}".

    Source Material:
    ${safeContext}

    Create exactly ${numQuestions} Multiple Choice Questions (MCQs).
    Difficulty: Intermediate to Hard.

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

  try {
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
    return {
      chapterId: "generated-id",
      questions: parsed.questions,
    };
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};

export const generateTopicVideo = async (
  topicTitle: string,
): Promise<string | null> => {
  // For video generation (Veo), we rely on the user selecting their own key via the aistudio helper
  // if available, OR we fall back to the env key.

  const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log("Starting video generation for:", topicTitle);
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
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await videoAi.operations.getVideosOperation({
        operation: operation,
      });
    }

    const video = operation.response?.generatedVideos?.[0]?.video;
    if (video?.uri) {
      return `${video.uri}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

export const generateMotivationalQuote = async (): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents:
        "Generate a single, short, high-energy motivational quote for a programmer or student. Maximum 8 words. Uppercase. No quotes.",
      config: { temperature: 1.0 },
    });
    return response.text ? response.text.trim() : null;
  } catch (e) {
    return null;
  }
};
