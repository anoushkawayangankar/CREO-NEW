import { MessageRecord, UserProfile } from '@/lib/db';
import { LearningSignalBundle } from './learningSignals';

type BuildPromptParams = {
  profile: UserProfile;
  signals: LearningSignalBundle;
  userMessage: string;
  topic?: string;
  mode?: 'default' | 'module-help';
  moduleContext?: {
    course?: string;
    difficulty?: string;
    currentModule?: string;
    currentTopics?: string[];
    userProgress?: string;
    lastQuizResult?: string;
  };
  systemPrompt?: string;
  controls?: {
    hint?: boolean;
    explainDifferently?: boolean;
    simplify?: boolean;
    overwhelmed?: boolean;
  };
  history: MessageRecord[];
};

const formatHistory = (history: MessageRecord[]) =>
  history
    .map(
      (item) =>
        `${item.role === 'assistant' ? 'Tutor' : 'Learner'}: ${item.content} ${
          item.learningMode ? '(Learning Mode)' : ''
        }`
    )
    .join('\n');

export const buildTutorPrompt = ({
  profile,
  signals,
  userMessage,
  topic,
  mode = 'default',
  moduleContext,
  systemPrompt,
  controls,
  history
}: BuildPromptParams) => {
  const moduleSystemDirectives =
    mode === 'module-help'
      ? systemPrompt ||
        `You are the user's personal learning coach for CREO.
You are currently assisting with the module: ${moduleContext?.currentModule || topic || 'current module'}.

Rules:
- Only answer questions related to the current module or prerequisites
- Use simple explanations first, then deeper ones if asked
- Use examples relevant to the user's skill level
- If the question is outside scope, gently redirect back
- Never repeat content already covered unless the user is confused`
      : '';

  const systemDirectives = `
${moduleSystemDirectives}
You are CREO's personal tutor. You are calm, patient, and your goal is learner understanding, not speed.
- Prefer guiding questions over answers. Keep replies tight and actionable.
- Explicitly adjust behavior when Learning Mode is ON.
- Always show empathy and encouragement, especially when frustration is detected.
- Never dump a full solution unless the learner explicitly asks for it.
`;

  const learningModeInstructions = signals.learningMode
    ? `Learning Mode is ACTIVE. Slow down. Use Socratic questioning, break the problem down, offer one hint at a time, propose a checkpoint, and confirm understanding before moving on. Encourage short wins.`
    : `Learning Mode is OFF. Be concise but still supportive. Offer concise guidance, and watch for signals to switch to Learning Mode if the learner gets stuck.`;

  const pacing = signals.recommendedPacing === 'slow' ? 'Keep responses under 170 words, focus on 1–2 steps.' : 'Keep responses under 140 words.';

  const profileContext = `
Learner Profile:
- Name: ${profile.name}
- Subjects: ${profile.subjects.join(', ') || 'unspecified'}
- Goals: ${profile.goals || 'not provided'}
- Preferred style: ${profile.learningStyle}
- Attention span: ${profile.attentionSpan}
- Past struggles: ${profile.pastStruggles.join(', ') || 'none recorded'}
`;

  const moduleContextBlock =
    mode === 'module-help'
      ? `
Module context:
- Course: ${moduleContext?.course || 'N/A'}
- Difficulty: ${moduleContext?.difficulty || 'unspecified'}
- Current module: ${moduleContext?.currentModule || topic || 'N/A'}
- Current topics: ${(moduleContext?.currentTopics || []).join(', ') || 'n/a'}
- User progress: ${moduleContext?.userProgress || 'not provided'}
- Last quiz result: ${moduleContext?.lastQuizResult || 'n/a'}
Guardrails:
- Stay within the current module scope; only pull in prerequisites if needed.
- Do not regenerate the course or ask the learner for details already supplied.
`
      : '';

  const controlRequests: string[] = [];
  if (controls?.hint) controlRequests.push('Provide a hint, not the answer.');
  if (controls?.explainDifferently) controlRequests.push('Reframe with a different analogy or viewpoint.');
  if (controls?.simplify) controlRequests.push('Simplify the language, keep jargon minimal.');
  if (controls?.overwhelmed) controlRequests.push('Offer reassurance and a single next action.');

  const responseChecklist = `
Output requirements:
- Start with a quick validation or empathy phrase tailored to ${profile.name}.
- Present guidance as short steps or a checkpoint question.
- Offer a quick micro-exercise or example if helpful.
- End with ONE direct question to confirm understanding or preference.
${controlRequests.length ? `\nSpecial controls: ${controlRequests.join(' ')}` : ''}
${mode === 'module-help' ? '\nStay scoped to this module and avoid unrelated topics.' : ''}
`;

  return `
${systemDirectives}
${learningModeInstructions}
${pacing}
${profileContext}
${moduleContextBlock}
Signals: Sentiment=${signals.sentiment} | Frustration=${signals.frustrationScore.toFixed(
    2
  )} | Reasons=${signals.reasons.join('; ') || 'n/a'} | Past struggle hits: ${
    signals.pastStrugglesHit.join(', ') || 'none'
  }
Topic: ${topic || 'unspecified'}
Controls: ${controlRequests.join(' ')}

Recent conversation:
${formatHistory(history)}

Current learner message: """${userMessage}"""

${responseChecklist}
`;
};
