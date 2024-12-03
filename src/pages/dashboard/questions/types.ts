/* eslint-disable @typescript-eslint/no-explicit-any */
import { EQuestionType } from "@/api/adminApis";

// Form Data Type
export interface FormData {
  NameAr: string;
  NameEn: string;
  piece: string;
  Skill: number;
  SubjectId: string;
  GradeId: string;
  LevelId: string;
  IsActive: boolean;
}

// Question Type
export interface Answer {
  Answer: string;
  IsCorrect: boolean;
  File: string;
}

export interface RelatedQuestion {
  ContentQuestion: string;
  File: string;
  Importance: boolean;
  QuestionType: EQuestionType;
  Score: number;
  Answers: Answer[];
}

export interface Question {
  ContentQuestion: string;
  File: string;
  Importance: boolean;
  QuestionType: EQuestionType;
  Score: number;
  RelatedQuestions: RelatedQuestion[];
  Answers: Answer[];
}

// MainForm Props
export interface MainFormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  useSchoolSearch: () => any;
  useGradeSearch: () => any;
  useLevelSearch: () => any;
}

// QuestionsSection Props
export interface QuestionsSectionProps {
  questions: Question[];
  onChange: (index: number, field: keyof Question, value: any) => void;
}
