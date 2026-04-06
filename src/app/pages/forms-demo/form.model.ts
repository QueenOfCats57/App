export interface RegistrationData {
  email: string;
  fullName: string;
  phone: string;
  birthDate: string;
  age: number;
  courseId?: number;
  agreeToTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  [key: string]: string | null;
}