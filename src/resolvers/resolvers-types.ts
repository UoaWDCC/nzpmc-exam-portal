import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Upload: any;
};

export type AddOptionInput = {
  option: Scalars['String'];
  questionID: Scalars['ID'];
  quizID: Scalars['ID'];
};

export type AddQuestionInput = {
  imageURI?: InputMaybe<Scalars['String']>;
  numOfAnswers: Scalars['Int'];
  question: Scalars['String'];
  quizID: Scalars['ID'];
  topics: Scalars['String'];
};

export type AddQuizInput = {
  description: Scalars['String'];
  duration: Scalars['Int'];
  endTime: Scalars['DateTime'];
  name: Scalars['String'];
  numOfQuestions: Scalars['Int'];
  startTime: Scalars['DateTime'];
};

export type AddUserInput = {
  displayName?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  photoURL?: InputMaybe<Scalars['String']>;
  quizID?: InputMaybe<Scalars['ID']>;
  role?: InputMaybe<Scalars['String']>;
  yearLevel?: InputMaybe<Scalars['String']>;
};

export type AddUserQuizInput = {
  quizID: Scalars['ID'];
  userID: Scalars['ID'];
};

export type EditAnswerInput = {
  option: Scalars['String'];
  questionID: Scalars['ID'];
  quizID: Scalars['ID'];
};

export type EditOptionInput = {
  id: Scalars['ID'];
  option: Scalars['String'];
  questionID: Scalars['ID'];
  quizID: Scalars['ID'];
};

export type EditQuestionInput = {
  id: Scalars['ID'];
  imageURI?: InputMaybe<Scalars['String']>;
  numOfAnswers?: InputMaybe<Scalars['Int']>;
  question?: InputMaybe<Scalars['String']>;
  quizID: Scalars['ID'];
  topics?: InputMaybe<Scalars['String']>;
};

export type EditQuizInput = {
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Int']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  numOfQuestions?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type EditSelfInput = {
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  photoURL?: InputMaybe<Scalars['String']>;
  yearLevel?: InputMaybe<Scalars['String']>;
};

export type EditUserInput = {
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  photoURL?: InputMaybe<Scalars['String']>;
  yearLevel?: InputMaybe<Scalars['String']>;
};

export type EditUserQuizInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  score?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  userQuizID: Scalars['ID'];
};

export type EditUserQuizQuestionInput = {
  answerID?: InputMaybe<Scalars['ID']>;
  flag?: InputMaybe<Scalars['Boolean']>;
  questionID: Scalars['ID'];
  userQuizID: Scalars['ID'];
};

export type Image = {
  __typename?: 'Image';
  imageURI: Scalars['String'];
};

export type ImageUploadInput = {
  image: Scalars['Upload'];
  questionID: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addOption?: Maybe<Option>;
  addQuestion?: Maybe<Question>;
  addQuiz?: Maybe<Quiz>;
  /** Admin */
  addUser?: Maybe<User>;
  addUserQuiz?: Maybe<UserQuiz>;
  editAnswer?: Maybe<Option>;
  editOption?: Maybe<Option>;
  editQuestion?: Maybe<Question>;
  editQuiz?: Maybe<Quiz>;
  /** User */
  editSelf?: Maybe<User>;
  editUser?: Maybe<User>;
  editUserQuiz?: Maybe<UserQuiz>;
  editUserQuizQuestion?: Maybe<UserQuizQuestion>;
  /** Image */
  image?: Maybe<Image>;
  submitUserQuizQuestions?: Maybe<UserQuiz>;
};


export type MutationAddOptionArgs = {
  input: AddOptionInput;
};


export type MutationAddQuestionArgs = {
  input: AddQuestionInput;
};


export type MutationAddQuizArgs = {
  input: AddQuizInput;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationAddUserQuizArgs = {
  input: AddUserQuizInput;
};


export type MutationEditAnswerArgs = {
  input: EditAnswerInput;
};


export type MutationEditOptionArgs = {
  input: EditOptionInput;
};


export type MutationEditQuestionArgs = {
  input: EditQuestionInput;
};


export type MutationEditQuizArgs = {
  input: EditQuizInput;
};


export type MutationEditSelfArgs = {
  input: EditSelfInput;
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationEditUserQuizArgs = {
  input: EditUserQuizInput;
};


export type MutationEditUserQuizQuestionArgs = {
  input: EditUserQuizQuestionInput;
};


export type MutationImageArgs = {
  input: ImageUploadInput;
};


export type MutationSubmitUserQuizQuestionsArgs = {
  input?: InputMaybe<SubmissionInput>;
};

export type Option = {
  __typename?: 'Option';
  created?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['DateTime']>;
  option?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  currentTime?: Maybe<Scalars['DateTime']>;
  /** Image */
  image: Array<Maybe<Image>>;
  /** General */
  me?: Maybe<User>;
  quiz?: Maybe<Quiz>;
  quizzes?: Maybe<Array<Maybe<Quiz>>>;
  /** Admin */
  user?: Maybe<User>;
  userQuiz?: Maybe<UserQuiz>;
  /** User */
  userQuizzes?: Maybe<Array<Maybe<UserQuiz>>>;
  users: UserPage;
};


export type QueryImageArgs = {
  questionID: Scalars['ID'];
};


export type QueryQuizArgs = {
  quizID: Scalars['ID'];
};


export type QueryUserArgs = {
  userID: Scalars['ID'];
};


export type QueryUserQuizArgs = {
  quizID: Scalars['ID'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UsersOrderByInput>;
  page?: InputMaybe<Scalars['Int']>;
};

export type Question = {
  __typename?: 'Question';
  answer?: Maybe<Option>;
  created?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  imageURI?: Maybe<Scalars['String']>;
  modified?: Maybe<Scalars['DateTime']>;
  numOfAnswers?: Maybe<Scalars['Int']>;
  options?: Maybe<Array<Maybe<Option>>>;
  question?: Maybe<Scalars['String']>;
  topics?: Maybe<Scalars['String']>;
};

export type Quiz = {
  __typename?: 'Quiz';
  created?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  endTime?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  numOfQuestions?: Maybe<Scalars['Int']>;
  question?: Maybe<Question>;
  questions?: Maybe<Array<Maybe<Question>>>;
  startTime?: Maybe<Scalars['DateTime']>;
};


export type QuizQuestionArgs = {
  id: Scalars['ID'];
};

export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SubmissionInput = {
  userQuizID: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  created?: Maybe<Scalars['DateTime']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  modified?: Maybe<Scalars['DateTime']>;
  photoURL?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  yearLevel?: Maybe<Scalars['String']>;
};

export type UserPage = {
  __typename?: 'UserPage';
  pages: Scalars['Int'];
  users: Array<User>;
};

export type UserQuiz = {
  __typename?: 'UserQuiz';
  created?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  endTime?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  modified?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  question?: Maybe<UserQuizQuestion>;
  questions?: Maybe<Array<Maybe<UserQuizQuestion>>>;
  score?: Maybe<Scalars['Int']>;
  startTime?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};


export type UserQuizQuestionArgs = {
  id: Scalars['ID'];
};

export type UserQuizQuestion = {
  __typename?: 'UserQuizQuestion';
  created?: Maybe<Scalars['DateTime']>;
  firstViewed?: Maybe<Scalars['DateTime']>;
  flag: Scalars['Boolean'];
  id: Scalars['ID'];
  imageURI?: Maybe<Scalars['String']>;
  lastAnswered?: Maybe<Scalars['DateTime']>;
  modified?: Maybe<Scalars['DateTime']>;
  options: Array<Option>;
  question: Scalars['String'];
  userAnswer?: Maybe<Option>;
};

export type UsersOrderByInput = {
  displayName?: InputMaybe<Sort>;
  email?: InputMaybe<Sort>;
  firstName?: InputMaybe<Sort>;
  lastName?: InputMaybe<Sort>;
  yearLevel?: InputMaybe<Sort>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddOptionInput: AddOptionInput;
  AddQuestionInput: AddQuestionInput;
  AddQuizInput: AddQuizInput;
  AddUserInput: AddUserInput;
  AddUserQuizInput: AddUserQuizInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  EditAnswerInput: EditAnswerInput;
  EditOptionInput: EditOptionInput;
  EditQuestionInput: EditQuestionInput;
  EditQuizInput: EditQuizInput;
  EditSelfInput: EditSelfInput;
  EditUserInput: EditUserInput;
  EditUserQuizInput: EditUserQuizInput;
  EditUserQuizQuestionInput: EditUserQuizQuestionInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<Image>;
  ImageUploadInput: ImageUploadInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Option: ResolverTypeWrapper<Option>;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolverTypeWrapper<Question>;
  Quiz: ResolverTypeWrapper<Quiz>;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubmissionInput: SubmissionInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  UserPage: ResolverTypeWrapper<UserPage>;
  UserQuiz: ResolverTypeWrapper<UserQuiz>;
  UserQuizQuestion: ResolverTypeWrapper<UserQuizQuestion>;
  UsersOrderByInput: UsersOrderByInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddOptionInput: AddOptionInput;
  AddQuestionInput: AddQuestionInput;
  AddQuizInput: AddQuizInput;
  AddUserInput: AddUserInput;
  AddUserQuizInput: AddUserQuizInput;
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  EditAnswerInput: EditAnswerInput;
  EditOptionInput: EditOptionInput;
  EditQuestionInput: EditQuestionInput;
  EditQuizInput: EditQuizInput;
  EditSelfInput: EditSelfInput;
  EditUserInput: EditUserInput;
  EditUserQuizInput: EditUserQuizInput;
  EditUserQuizQuestionInput: EditUserQuizQuestionInput;
  ID: Scalars['ID'];
  Image: Image;
  ImageUploadInput: ImageUploadInput;
  Int: Scalars['Int'];
  Mutation: {};
  Option: Option;
  Query: {};
  Question: Question;
  Quiz: Quiz;
  String: Scalars['String'];
  SubmissionInput: SubmissionInput;
  Upload: Scalars['Upload'];
  User: User;
  UserPage: UserPage;
  UserQuiz: UserQuiz;
  UserQuizQuestion: UserQuizQuestion;
  UsersOrderByInput: UsersOrderByInput;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  imageURI?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType, RequireFields<MutationAddOptionArgs, 'input'>>;
  addQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationAddQuestionArgs, 'input'>>;
  addQuiz?: Resolver<Maybe<ResolversTypes['Quiz']>, ParentType, ContextType, RequireFields<MutationAddQuizArgs, 'input'>>;
  addUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationAddUserArgs, 'input'>>;
  addUserQuiz?: Resolver<Maybe<ResolversTypes['UserQuiz']>, ParentType, ContextType, RequireFields<MutationAddUserQuizArgs, 'input'>>;
  editAnswer?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType, RequireFields<MutationEditAnswerArgs, 'input'>>;
  editOption?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType, RequireFields<MutationEditOptionArgs, 'input'>>;
  editQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationEditQuestionArgs, 'input'>>;
  editQuiz?: Resolver<Maybe<ResolversTypes['Quiz']>, ParentType, ContextType, RequireFields<MutationEditQuizArgs, 'input'>>;
  editSelf?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationEditSelfArgs, 'input'>>;
  editUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationEditUserArgs, 'input'>>;
  editUserQuiz?: Resolver<Maybe<ResolversTypes['UserQuiz']>, ParentType, ContextType, RequireFields<MutationEditUserQuizArgs, 'input'>>;
  editUserQuizQuestion?: Resolver<Maybe<ResolversTypes['UserQuizQuestion']>, ParentType, ContextType, RequireFields<MutationEditUserQuizQuestionArgs, 'input'>>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationImageArgs, 'input'>>;
  submitUserQuizQuestions?: Resolver<Maybe<ResolversTypes['UserQuiz']>, ParentType, ContextType, Partial<MutationSubmitUserQuizQuestionsArgs>>;
};

export type OptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Option'] = ResolversParentTypes['Option']> = {
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  image?: Resolver<Array<Maybe<ResolversTypes['Image']>>, ParentType, ContextType, RequireFields<QueryImageArgs, 'questionID'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  quiz?: Resolver<Maybe<ResolversTypes['Quiz']>, ParentType, ContextType, RequireFields<QueryQuizArgs, 'quizID'>>;
  quizzes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quiz']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userID'>>;
  userQuiz?: Resolver<Maybe<ResolversTypes['UserQuiz']>, ParentType, ContextType, RequireFields<QueryUserQuizArgs, 'quizID'>>;
  userQuizzes?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserQuiz']>>>, ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UserPage'], ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  answer?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  numOfAnswers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['Option']>>>, ParentType, ContextType>;
  question?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topics?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuizResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quiz'] = ResolversParentTypes['Quiz']> = {
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  numOfQuestions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<QuizQuestionArgs, 'id'>>;
  questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Question']>>>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailVerified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  photoURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  yearLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPage'] = ResolversParentTypes['UserPage']> = {
  pages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserQuizResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserQuiz'] = ResolversParentTypes['UserQuiz']> = {
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  question?: Resolver<Maybe<ResolversTypes['UserQuizQuestion']>, ParentType, ContextType, RequireFields<UserQuizQuestionArgs, 'id'>>;
  questions?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserQuizQuestion']>>>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserQuizQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserQuizQuestion'] = ResolversParentTypes['UserQuizQuestion']> = {
  created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  firstViewed?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  flag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastAnswered?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['Option']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userAnswer?: Resolver<Maybe<ResolversTypes['Option']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Option?: OptionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Quiz?: QuizResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
  UserQuiz?: UserQuizResolvers<ContextType>;
  UserQuizQuestion?: UserQuizQuestionResolvers<ContextType>;
};

