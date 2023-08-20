export type UserQuizQuestionModel = {
  userQuizID: string;
  id: string;
  firstViewed: Date | null;
  flag: boolean;
  imageURI: string;
  lastAnswered: Date | null;
  question: string;
  created: Date;
  modified: Date;
};
