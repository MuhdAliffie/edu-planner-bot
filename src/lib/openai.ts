
// OpenAI API utility

// Note: In a production app, this API key should be stored securely server-side
// This is just for demonstration purposes
const OPENAI_API_KEY = "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";

export type LessonPlanParams = {
  subject: string;
  gradeLevel: string;
  duration: string;
  learningObjectives: string;
  additionalInstructions?: string;
};

export type LessonPlanResponse = {
  title: string;
  overview: string;
  objectives: string[];
  materials: string[];
  procedure: {
    introduction: string;
    mainActivity: string;
    conclusion: string;
  };
  assessment: string;
  extensions: string[];
  notes: string;
};

export async function generateLessonPlan(params: LessonPlanParams): Promise<LessonPlanResponse> {
  try {
    const prompt = `
    Generate a detailed lesson plan for a ${params.subject} class for ${params.gradeLevel} grade students.
    The lesson should be designed for ${params.duration}.
    
    Learning objectives: ${params.learningObjectives}
    
    Additional instructions: ${params.additionalInstructions || 'None'}
    
    Please format the response as a structured lesson plan with the following sections:
    - Title (creative and engaging)
    - Overview (brief summary of the lesson)
    - Learning Objectives (bullet points)
    - Materials Needed (bullet points)
    - Procedure (with introduction, main activity, and conclusion)
    - Assessment Methods
    - Extensions/Homework
    - Teacher Notes
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an experienced education specialist who creates detailed, engaging lesson plans following best educational practices.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the response into structured format
    // This is a simplified parsing - in a real app, you'd want to use
    // a more robust parsing strategy or have the API return structured data
    
    // For this demo, we'll manually structure the data
    // In reality, you might want to have GPT return JSON directly
    const parsedResponse: LessonPlanResponse = {
      title: extractSection(content, "Title") || params.subject + " Lesson Plan",
      overview: extractSection(content, "Overview") || "",
      objectives: extractBulletPoints(extractSection(content, "Learning Objectives") || extractSection(content, "Objectives") || ""),
      materials: extractBulletPoints(extractSection(content, "Materials") || extractSection(content, "Materials Needed") || ""),
      procedure: {
        introduction: extractSection(content, "Introduction") || 
                      extractSectionFromProcedure(content, "Introduction") || "",
        mainActivity: extractSection(content, "Main Activity") || 
                      extractSectionFromProcedure(content, "Main Activity") ||
                      extractSectionFromProcedure(content, "Development") || "",
        conclusion: extractSection(content, "Conclusion") || 
                    extractSectionFromProcedure(content, "Conclusion") ||
                    extractSectionFromProcedure(content, "Closure") || "",
      },
      assessment: extractSection(content, "Assessment") || 
                 extractSection(content, "Assessment Methods") || "",
      extensions: extractBulletPoints(extractSection(content, "Extensions") || 
                  extractSection(content, "Extensions/Homework") || 
                  extractSection(content, "Homework") || ""),
      notes: extractSection(content, "Teacher Notes") || 
             extractSection(content, "Notes") || "",
    };

    return parsedResponse;
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
}

// Helper functions to extract data from the AI response
function extractSection(text: string, sectionName: string): string | null {
  const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\s*\\w+:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractSectionFromProcedure(text: string, sectionName: string): string | null {
  // Look for the section within a "Procedure" section
  const procedureSection = extractSection(text, "Procedure");
  if (!procedureSection) return null;
  
  const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\s*\\w+:|$)`, 'i');
  const match = procedureSection.match(regex);
  return match ? match[1].trim() : null;
}

function extractBulletPoints(text: string | null): string[] {
  if (!text) return [];
  
  // Identify bullet points by looking for lines that start with -, *, or numbers followed by a dot
  const bulletRegex = /^(?:\-|\*|\d+\.)\s*(.+)$/gm;
  const bullets = [];
  let match;
  
  while ((match = bulletRegex.exec(text)) !== null) {
    bullets.push(match[1].trim());
  }
  
  // If no bullet points were found but there's text, split by newlines
  if (bullets.length === 0 && text.trim()) {
    return text.split('\n').map(line => line.trim()).filter(line => line);
  }
  
  return bullets;
}
