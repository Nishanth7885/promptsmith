// Core data schema for Prompt Smith

export interface Prompt {
  id: string;                    // "students-mech-001"
  title: string;                 // "Design a Gear Train System"
  prompt: string;                // The actual prompt text (200-500 words)
  category: string;              // "students"
  subcategory: string;           // "mechanical-engineering"
  tags: string[];                // ["design", "gears", "CAD"]
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiTool: 'any' | 'chatgpt' | 'claude' | 'gemini' | 'midjourney';
  outputType: 'text' | 'code' | 'analysis' | 'creative' | 'data';
  isFree: boolean;               // true for ~50 preview prompts
}

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
  promptCount: number;
  icon: string;                  // emoji
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;                  // emoji
  color: string;                 // hex accent color
  subcategories: Subcategory[];
  totalPrompts: number;
}
