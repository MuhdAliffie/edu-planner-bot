// OpenAI API utility

// Note: In a production app, this API key should be stored securely server-side
// This is just for demonstration purposes
const OPENAI_API_KEY = "sk-"; // Remove the incorrect API key

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
    // For demo purposes since the API key is invalid, return a mock response
    // This will allow you to test the UI without a valid API key
    console.log("Generating lesson plan with parameters:", params);
    
    // Mock response to allow testing the UI
    const mockResponse: LessonPlanResponse = {
      title: `${params.subject} Lesson: Mastering Key Concepts`,
      overview: `This ${params.duration} lesson for ${params.gradeLevel} students focuses on ${params.subject} with an emphasis on ${params.learningObjectives}.`,
      objectives: [
        `Students will be able to ${params.learningObjectives}`,
        "Students will demonstrate critical thinking skills",
        "Students will engage in collaborative learning"
      ],
      materials: [
        "Textbook",
        "Worksheets",
        "Digital presentation",
        "Assessment materials"
      ],
      procedure: {
        introduction: "Begin with an engaging hook to capture student interest. Review previous knowledge and introduce the lesson objectives.",
        mainActivity: "Guide students through new concepts with clear examples. Provide opportunities for guided practice followed by independent work. Incorporate discussion and peer collaboration.",
        conclusion: "Summarize key points learned. Have students reflect on their learning through exit tickets or short discussion."
      },
      assessment: "Use formative assessment throughout the lesson with questioning techniques. Collect exit tickets to gauge understanding. Provide specific feedback on student work.",
      extensions: [
        "Additional practice problems for reinforcement",
        "Challenge activities for advanced students",
        "Review materials for students needing additional support"
      ],
      notes: `Adjust pacing as needed. ${params.additionalInstructions ? 'Note: ' + params.additionalInstructions : 'Be prepared with additional examples if students struggle with concepts.'}`
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockResponse;
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
