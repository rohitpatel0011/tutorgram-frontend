/** @format */

import { Task } from "../types";
import { CONTENT_DATA } from "../constants";

// NOTE: This file now only handles generating daily tasks for the client.
// User data and progress are handled by the Backend API via services/api.ts

// --- Dynamic Task Generation ---
const generateDailyTasks = (): Task[] => {
  // Flatten topics for selection
  const allTopics = CONTENT_DATA.flatMap(c =>
    c.chapters.flatMap(ch => ch.topics.map(t => ({ ...t, chapterId: ch.id }))),
  );
  const allChapters = CONTENT_DATA.flatMap(c => c.chapters);

  // Get 3 random items
  const randomTopic1 = allTopics[Math.floor(Math.random() * allTopics.length)];
  const randomTopic2 = allTopics[Math.floor(Math.random() * allTopics.length)];
  const randomChapter =
    allChapters[Math.floor(Math.random() * allChapters.length)];

  return [
    {
      id: `t-${Date.now()}-1`,
      title: `Read: ${randomTopic1.title}`,
      completed: false,
      type: "read",
      targetId: randomTopic1.id,
      dueDate: "Today",
    },
    {
      id: `t-${Date.now()}-2`,
      title: `Regenerate: Explain "${randomTopic2.title}" simply`,
      completed: false,
      type: "regenerate",
      targetId: randomTopic2.id,
      dueDate: "Today",
    },
    {
      id: `t-${Date.now()}-3`,
      title: `Quiz: ${randomChapter.title}`,
      completed: false,
      type: "quiz",
      targetId: randomChapter.id,
      dueDate: "Tomorrow",
    },
  ];
};

export const getInitialTasks = () => generateDailyTasks();
