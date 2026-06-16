export interface User {
  userid: string;
  username: string;
  password?: string;
  emailid: string;
  contact: number;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  forms?: FormData[];
}

export interface UserDto {
  id: string;
  username: string;
  emailid: string;
  contact: number;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
}

export interface UserFormDto {
  userid: string;
  username: string;
  email: string;
}

export interface QuestionDto {
  id?: string;
  type: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder: string;
  required: boolean;
  order: number;
  options: string[];
}

export interface FormDto {
  id?: string;
  title: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: UserFormDto;
  questions: QuestionDto[];
}

export interface Question {
  questionid: string;
  question: string; // matches backend "question" (which is label)
  answer_type: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  options: string[];
  placeholder: string | null;
  is_required: boolean;
  validations: Record<string, string> | null;
  defaultValue: string | null;
  orderno: number;
  form?: any;
}

export interface FormData {
  formid: string;
  title: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  questions: Question[];
  submissions?: FormSubmissions[];
}

export interface Answer {
  answerid?: string;
  question: {
    questionid: string;
  };
  response: {
    value: any; // e.g. string, number, or string[] for checkboxes
  };
}

export interface FormSubmissions {
  submissionid?: string;
  emailid: string;
  form: {
    formid: string;
  };
  answers: Answer[];
  submittedAt?: string;
}

export interface SubmissionResponse {
  submissionid: string;
  emailid: string;
  form: {
    formid: string;
    title: string;
  };
  answers: {
    answerid: string;
    question: {
      questionid: string;
      question: string;
      answer_type: string;
    };
    response: {
      value: any;
    };
  }[];
  submittedAt: string;
}
