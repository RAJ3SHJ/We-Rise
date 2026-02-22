
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLearningPath(profile: UserProfile, availableCourses: Course[]) {
  const coursePoolString = availableCourses.map(c => 
    `ID: ${c.id}, Title: ${c.title}, Level: ${c.level}, Category: ${c.category}, Description: ${c.description}`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are a Career Counselor for "We Rise". 
    A student with a background in ${profile.background} wants to transition to a Product Owner role.
    Their primary career goal is: ${profile.careerGoal || 'Not specified'}.
    They are currently skilled in: ${profile.skills.join(', ')}. 
    They commit ${profile.availabilityHoursPerWeek} hours per week.

    ACT AS A FILTER: Below is a list of hand-picked courses from our administrators. 
    Select the 6 MOST RELEVANT courses from this list to create their personalized path. 
    DO NOT invent courses. ONLY use the provided IDs.

    AVAILABLE COURSES:
    ${coursePoolString}

    Provide a response with a catchy title for their path and the selected Course IDs.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          selectedCourseIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['title', 'selectedCourseIds']
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    // Map IDs back to full course objects
    const selectedCourses = data.selectedCourseIds
      .map((id: string) => availableCourses.find(c => c.id === id))
      .filter(Boolean);

    return {
      title: data.title,
      courses: selectedCourses
    };
  } catch (error) {
    console.error("System Process Error", error);
    return null;
  }
}

export async function getMentorAdvice(question: string, profile: UserProfile) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a Senior Product Owner Mentor at "We Rise". A student with a background in ${profile.background} asks: "${question}". Provide helpful, professional advice.`,
    });
    return response.text;
}

export async function evaluatePerformance(score: number, total: number, profile: UserProfile) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Score: ${score}/${total}. Background: ${profile.background}. Give expert PO transition feedback on behalf of "We Rise".`,
  });
  return response.text;
}
