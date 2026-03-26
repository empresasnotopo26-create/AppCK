export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  isAdmin?: boolean;
  isActive?: boolean;
}

export type ResponseType = 'quiz' | 'pesquisa' | 'pre-almoco' | 'nps' | 'winner' | 'quiz_draft';

export interface BaseResponse {
  id: string;
  userId: string;
  type: ResponseType;
  createdAt: string;
}

export interface QuizResponse extends BaseResponse {
  type: 'quiz';
  data: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
  };
}

export interface PesquisaResponse extends BaseResponse {
  type: 'pesquisa';
  data: {
    revenue: string;
    biggestChallenge: string;
    aiDoubts: string;
    morningRating?: number;
    afternoonExpectation?: string;
  };
}

export interface PreAlmocoResponse extends BaseResponse {
  type: 'pre-almoco';
  data: {
    dataClarity: number;
    processExecution: number;
    salesPredictability: number;
    customerEvaluation: number;
  };
}

export interface NPSResponse extends BaseResponse {
  type: 'nps';
  data: {
    score: number;
    suggestion: string;
  };
}

export interface WinnerResponse extends BaseResponse {
  type: 'winner';
  data: {
    winnerId: string;
  };
}

export interface QuizDraftResponse extends BaseResponse {
  type: 'quiz_draft';
  data: {
    started: boolean;
  };
}

export type AppResponse = QuizResponse | PesquisaResponse | PreAlmocoResponse | NPSResponse | WinnerResponse | QuizDraftResponse;

export interface AppState {
  users: User[];
  currentUser: User | null;
  responses: AppResponse[];
  winners: User[];
}

export interface AuthResult {
  success: boolean;
  error?: string;
  isAdmin?: boolean;
}