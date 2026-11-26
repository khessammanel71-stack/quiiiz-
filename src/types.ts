export type HumorStyle = 'sarcastic' | 'memes' | 'dark' | 'all';

export type RelationshipType = 'boyfriend' | 'crush' | 'special' | 'complicated' | 'custom';

export interface UserConfig {
  nickname: string;
  senderName: string;
  relationship: RelationshipType;
  relationshipLabel: string;
  humorStyle: HumorStyle;
  personalMessage: string;
  age?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  tagline?: string;
  stickerUrl?: string;
  reaction: {
    title: string;
    description: string;
    badge: string;
    imageType?: 'cat' | 'space' | 'robot' | 'cake' | 'sideEye' | 'custom';
    stickerUrl?: string;
    emoji: string;
    audioEffect?: 'warning' | 'error' | 'select' | 'whoosh';
  };
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  subtitle: string;
  stickerUrl?: string;
  options: QuestionOption[];
}

export interface PersonalityReport {
  subjectName: string;
  intelligence: string;
  curiosity: string;
  overthinking: string;
  humor: string;
  questioningProbability: string;
  finalDiagnosis: string;
  verdictBadge: string;
}

export type ExperimentStage =
  | 'intro'
  | 'questionnaire'
  | 'analyzing'
  | 'report'
  | 'birthday_reveal'
  | 'extras';
