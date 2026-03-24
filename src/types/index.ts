export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type ResponseType = 'quiz' | 'pesquisa' | 'pre-almoco' | 'nps';

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
  };
}

export interface PesquisaResponse extends BaseResponse {
  type: 'pesquisa';
  data: {
    revenue: string;
    biggestChallenge: string;
    aiDoubts: string;
  };
}

export interface PreAlmocoResponse extends BaseResponse {
  type: 'pre-almoco';
  data: {
    clarityScore: number;
    usefulnessScore: number;
    relevantTheme: string;
    afternoonDoubts: string;
  };
}

export interface NPSResponse extends BaseResponse {
  type: 'nps';
  data: {
    score: number;
    suggestion: string;
  };
}

export type AppResponse = QuizResponse | PesquisaResponse | PreAlmocoResponse | NPSResponse;

export interface AppState {
  users: User[];
  currentUser: User | null;
  responses: AppResponse[];
  winners: User[];
}