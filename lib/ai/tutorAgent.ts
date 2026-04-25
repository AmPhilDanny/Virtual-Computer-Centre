import { streamText, generateText, ModelMessage } from "ai";
import { getActiveAiModel } from "./factory";

export async function generateTutorResponse(
  messages: ModelMessage[],
  studentProfile: any,
  knowledgeBase: string,
  learningPatterns: any
) {
  const model = await getActiveAiModel();

  const systemPrompt = `
You are the "AI Tutor" for the Virtual Computer Centre. Your goal is to teach students effectively based on their provided materials and learning style.

STUDENT PROFILE:
- Name: ${studentProfile?.name || "Student"}
- Level: ${studentProfile?.academicLevel || "General Learner"}
- Learning Style: ${studentProfile?.learningStyle || "Visual/Adaptive"}
- Interests: ${studentProfile?.interests || "General Science & Tech"}
- Bio/Goals: ${studentProfile?.bio || "No specific goals set."}

KNOWLEDGE BASE (Extracted from Student's Textbooks/Curriculums):
"""
${knowledgeBase}
"""

CURRENT LEARNING PATTERNS/INSIGHTS:
${JSON.stringify(learningPatterns || {}, null, 2)}

INSTRUCTIONS:
1. ONLY answer based on the Knowledge Base and general academic principles.
2. ADAPT your tone and complexity to the student's level and learning style.
3. If they are a "Visual" learner, use descriptive analogies or suggest diagrams.
4. If they are an "Auditory" learner, use conversational and rhythmic language.
5. BE ENCOURAGING. Do not just give answers; guide the student to the answer.
6. LEARN from them. Observe if they struggle with specific concepts and adjust your future depth accordingly.
7. Keep responses concise but comprehensive.
`;

  return streamText({
    model,
    system: systemPrompt,
    messages,
  });
}

export async function reflectOnSession(messages: ModelMessage[], currentPatterns: any) {
  const model = await getActiveAiModel();

  const reflectionPrompt = `
Analyze the following conversation between an AI Tutor and a Student. 
Your goal is to extract "Learning Patterns" to improve future tutoring sessions.

CURRENT PATTERNS:
${JSON.stringify(currentPatterns || {}, null, 2)}

CONVERSATION:
${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

OUTPUT REQUIREMENTS:
Return a JSON object containing:
1. "strengths": Array of concepts the student understands well.
2. "weaknesses": Array of concepts the student struggles with.
3. "preferredStyle": Updated learning style (Visual, Logical, Auditory, etc.).
4. "engagementScore": 1-10 based on how active the student is.
5. "recommendedFocus": Next topics to cover.

ONLY return the JSON object. No markdown, no text.
`;

  const { text } = await generateText({
    model,
    prompt: reflectionPrompt,
  });

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse reflection JSON:", text);
    return currentPatterns;
  }
}

export async function generateAssessment(knowledgeBase: string, topic: string, studentLevel: string) {
  const model = await getActiveAiModel();

  const prompt = `
Generate a 5-question multiple-choice quiz based on the following Knowledge Base.
Target Level: ${studentLevel}
Topic: ${topic}

KNOWLEDGE BASE:
${knowledgeBase.substring(0, 10000)}

OUTPUT REQUIREMENTS:
Return a JSON array of objects, each containing:
1. "question": The question text.
2. "options": Array of 4 strings.
3. "correctIndex": Index of the correct option (0-3).
4. "explanation": Why the answer is correct.

ONLY return the JSON array.
`;

  const { text } = await generateText({
    model,
    prompt,
  });

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse assessment JSON:", text);
    throw new Error("Failed to generate quiz.");
  }
}

export async function gradeAssessment(questions: any[], answers: number[], studentContext: string) {
  const model = await getActiveAiModel();

  let correctCount = 0;
  questions.forEach((q, i) => {
    if (q.correctIndex === answers[i]) {
      correctCount++;
    }
  });

  const score = (correctCount / questions.length) * 100;

  const feedbackPrompt = `
Analyze a student's performance on a quiz.
Score: ${score}% (${correctCount}/${questions.length} correct)
Context: ${studentContext}

QUESTIONS & ANSWERS:
${questions.map((q, i) => `Q: ${q.question}\nStudent Answer: ${q.options[answers[i]] || "None"}\nCorrect: ${q.correctIndex === answers[i] ? "YES" : "NO"}`).join("\n\n")}

Provide a brief, encouraging feedback message (2-3 sentences) that highlights what they did well and what they should review.
`;

  const { text: feedback } = await generateText({
    model,
    prompt: feedbackPrompt,
  });

  return {
    score,
    correctCount,
    feedback
  };
}
