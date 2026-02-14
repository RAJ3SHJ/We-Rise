
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CourseLevel, CourseStatus } from "../types";

// Always use the direct process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLearningPath(profile: UserProfile) {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a detailed Product Owner learning path for someone with a background in ${profile.background}. 
    They are currently skilled in: ${profile.skills.join(', ')}. 
    They can commit ${profile.availabilityHoursPerWeek} hours per week.
    Please suggest 6 courses categorized by level (Basic to Advanced).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          courses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                source: { type: Type.STRING, description: 'e.g., Udemy, YouTube, Coursera' },
                level: { type: Type.STRING, enum: ['Basic', 'Intermediate', 'Advanced'] },
                category: { type: Type.STRING },
                durationHours: { type: Type.NUMBER },
                description: { type: Type.STRING },
                deadlineWeeks: { type: Type.NUMBER, description: 'How many weeks from start should this be completed?' }
              },
              required: ['id', 'title', 'source', 'level', 'category', 'durationHours', 'description', 'deadlineWeeks']
            }
          }
        },
        required: ['title', 'courses']
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return null;
  }
}

export async function getMentorAdvice(question: string, profile: UserProfile) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a Senior Product Owner Mentor. A student with a background in ${profile.background} asks: "${question}". Provide a helpful, encouraging, and professional response.`,
    });
    return response.text;
}

export async function evaluatePerformance(score: number, total: number, profile: UserProfile) {
  const percentage = (score / total) * 100;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `A student transition to a Product Owner role from a ${profile.background} background just scored ${score}/${total} (${percentage}%) on a knowledge assessment. 
    Provide concise, expert feedback. If the score is high, suggest advanced topics. If the score is low, provide encouragement and suggest which fundamentals to revisit.`,
  });
  return response.text;
}
