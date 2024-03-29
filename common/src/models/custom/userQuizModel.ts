import { QuestionModel } from "./questionModel";

export type UserQuizModel = {
  userID: string;
  quizID: string;
  expired: boolean;
  id: string;
  name: string;
  description: string;
  duration: number;
  questions?: QuestionModel[];
  quizStart?: number;
  score?: number;
  submitted?: boolean;
  released?: boolean;
  openTime?: Date;
  closeTime?: Date;
  created: Date;
  modified: Date;
};
