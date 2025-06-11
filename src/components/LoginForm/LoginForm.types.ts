export type AuthMode = "login" | "signup";

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
