import { QuestionModel } from "./questionModel";

export type QuizModel = {
  created: Date;
  description: string;
  duration: number;
  endTime: Date;
  id: string;
  modified: string;
  name: string;
  questions: QuestionModel[];
  startTime: Date;
};
