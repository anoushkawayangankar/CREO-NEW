import { getUniversalApiKey } from '@/lib/apiKeys';
import { ModuleKnowledgeSnapshot, getModuleSnapshot, upsertModuleSnapshot } from '@/lib/db';
import { callLLMWithRetry } from '@/app/utils/llmClient';
import { safeJsonParse } from '@/app/utils/jsonHelpers';

type SnapshotParams = {
  moduleId: string;
  course?: string;
  difficulty?: ModuleKnowledgeSnapshot['difficulty'];
  title?: string;
  depth?: ModuleKnowledgeSnapshot['depth'];
};

type GenerationResult = {
  snapshot: ModuleKnowledgeSnapshot;
  source: 'existing' | 'mock' | 'ai';
};

const NOW = () => new Date().toISOString();

const MOCK_SNAPSHOTS: Record<string, ModuleKnowledgeSnapshot> = {
  'arrays-iteration-js': {
    moduleId: 'arrays-iteration-js',
    course: 'JavaScript Fundamentals',
    difficulty: 'beginner',
    title: 'Arrays and Iteration',
    concepts: ['Arrays', 'Looping through arrays', 'Indexing'],
    explanations: [
      {
        concept: 'Arrays',
        explanation: 'An array stores multiple values in a single variable and keeps order.',
        example: "const fruits = ['apple', 'banana'];"
      },
      {
        concept: 'Looping through arrays',
        explanation: 'Use loops to access each element one by one.',
        example: 'for (const fruit of fruits) { console.log(fruit); }'
      },
      {
        concept: 'Indexing',
        explanation: 'Array items are zero-indexed, so the first item is at index 0.',
        example: 'const first = fruits[0]; // "apple"'
      }
    ],
    prerequisites: ['Variables', 'Basic data types'],
    depth: 'standard',
    generatedBy: 'mock',
    createdAt: NOW(),
    updatedAt: NOW()
  }
};

const buildMockSnapshot = (params: SnapshotParams): ModuleKnowledgeSnapshot => {
  const known = MOCK_SNAPSHOTS[params.moduleId];
  if (known) return known;

  const title = params.title || params.moduleId.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) || 'Current Module';
  return {
    moduleId: params.moduleId,
    course: params.course || 'Self-paced course',
    difficulty: params.difficulty || 'intermediate',
    title,
    concepts: [title, 'Core steps', 'Common pitfalls'],
    explanations: [
      {
        concept: title,
        explanation: `${title} is the focus concept. Keep the scope tight and build intuition first.`,
        example: 'Write a 2–3 sentence summary in your own words.'
      },
      {
        concept: 'Core steps',
        explanation: 'Break the task into 3–4 small actions and test after each step.',
        example: 'Draft → test → adjust → summarize.'
      },
      {
        concept: 'Common pitfalls',
        explanation: 'Watch for vague goals and skipping small validations.',
        example: 'State the expected output before you run the code.'
      }
    ],
    prerequisites: ['Review the previous module briefly'],
    depth: params.depth || 'standard',
    generatedBy: 'mock',
    createdAt: NOW(),
    updatedAt: NOW()
  };
};

const buildGeminiPrompt = (params: SnapshotParams) => {
  return `You are generating learning content for a student.

Context:
- Topic: ${params.title || params.moduleId}
- Level: ${params.difficulty || 'intermediate'}
- Course: ${params.course || 'CREO Path'}
- Goal: understanding, not memorization

Rules:
- Stay within topic and prerequisites only.
- Use simple language and concise examples.
- Do not invent unrelated advanced topics.
- Output JSON only following this TypeScript shape:
type ModuleKnowledgeSnapshot = {
  moduleId: string;
  course: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  title: string;
  concepts: string[];
  explanations: { concept: string; explanation: string; example?: string }[];
  prerequisites: string[];
  depth: "light" | "standard" | "deep";
  generatedBy: "ai";
}

Return only JSON.`;
};

const parseSnapshot = (raw: any, fallback: ModuleKnowledgeSnapshot): ModuleKnowledgeSnapshot => {
  if (!raw || typeof raw !== 'object') return fallback;
  const snapshot: ModuleKnowledgeSnapshot = {
    moduleId: raw.moduleId || fallback.moduleId,
    course: raw.course || fallback.course,
    difficulty: raw.difficulty || fallback.difficulty,
    title: raw.title || fallback.title,
    concepts: Array.isArray(raw.concepts) && raw.concepts.length ? raw.concepts : fallback.concepts,
    explanations: Array.isArray(raw.explanations) && raw.explanations.length ? raw.explanations : fallback.explanations,
    prerequisites: Array.isArray(raw.prerequisites) && raw.prerequisites.length ? raw.prerequisites : fallback.prerequisites,
    depth: raw.depth || fallback.depth,
    generatedBy: 'ai',
    createdAt: fallback.createdAt,
    updatedAt: NOW()
  };
  return snapshot;
};

export async function ensureSnapshot(params: SnapshotParams): Promise<GenerationResult> {
  const existing = getModuleSnapshot(params.moduleId);
  if (existing) {
    return { snapshot: existing, source: 'existing' };
  }

  const mockFallback = buildMockSnapshot(params);

  let apiKey: string | null = null;
  try {
    apiKey = await getUniversalApiKey();
  } catch {
    apiKey = null;
  }

  if (!apiKey) {
    upsertModuleSnapshot(mockFallback);
    return { snapshot: mockFallback, source: 'mock' };
  }

  try {
    const prompt = buildGeminiPrompt(params);
    const { response } = await callLLMWithRetry({
      apiKey,
      provider: 'gemini',
      model: 'gemini-2.0-flash-exp',
      body: {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
      },
      maxRetries: 1
    });

    if (response) {
      const rawText = await response.text();
      const parsed = safeJsonParse(rawText);
      if (parsed.success && parsed.data) {
        const snapshot = parseSnapshot(parsed.data, mockFallback);
        const stored = upsertModuleSnapshot(snapshot);
        return { snapshot: stored, source: 'ai' };
      }
    }
  } catch (err) {
    console.warn('Snapshot AI generation failed, using mock', err);
  }

  upsertModuleSnapshot(mockFallback);
  return { snapshot: mockFallback, source: 'mock' };
}

export const buildNotesFromSnapshot = async (snapshot: ModuleKnowledgeSnapshot) => {
  return {
    type: 'notes' as const,
    content: {
      sections: snapshot.explanations.map((item) => ({
        title: item.concept,
        explanation: item.explanation,
        example: item.example
      }))
    },
    generatedBy: snapshot.generatedBy
  };
};

export const buildQuizFromSnapshot = async (snapshot: ModuleKnowledgeSnapshot) => {
  const concepts = snapshot.concepts.slice(0, 3);
  const explanations = snapshot.explanations;

  const mcq = concepts.slice(0, 2).map((concept, index) => ({
    type: 'mcq' as const,
    question: `What best describes ${concept}?`,
    options: [
      `Unrelated detail about ${concept}`,
      explanations[index]?.explanation || `A core idea of ${concept}`,
      'Purely memorization of syntax',
      'No relation to the module'
    ],
    answer: explanations[index]?.explanation || explanations[0]?.explanation || concepts[0]
  }));

  const outputQuestions = explanations.slice(0, 2).map((item, idx) => ({
    type: 'output' as const,
    question: `Based on the example for ${item.concept}, what should happen?`,
    code: item.example || `// describe the expected behavior for ${item.concept}`,
    answer: idx === 0 ? 'It processes each element in sequence.' : 'It accesses an indexed element or prints items one by one.'
  }));

  const reasoning = {
    type: 'reasoning' as const,
    question: `Why does mastering ${concepts[0] || snapshot.title} matter before moving on?`,
    answer: `It is the foundation for the rest of the module and prevents confusion in later steps.`
  };

  return {
    type: 'quiz' as const,
    questions: [...mcq, ...outputQuestions, reasoning],
    generatedBy: snapshot.generatedBy
  };
};

export const buildApplyTaskFromSnapshot = async (snapshot: ModuleKnowledgeSnapshot) => {
  const mainConcept = snapshot.concepts[0] || snapshot.title;
  const secondary = snapshot.explanations[1]?.concept || 'core step';
  return {
    type: 'homework' as const,
    task: {
      title: `${mainConcept} practice`,
      description: `Create a small artifact that demonstrates ${mainConcept} and ${secondary}. Keep it concise and runnable.`,
      constraints: ['Keep scope under 15 minutes', 'Show the output or result', 'Add one quick reflection bullet'],
      hint: snapshot.explanations[0]?.example || 'Outline the steps before coding.'
    },
    generatedBy: snapshot.generatedBy
  };
};
