export type SignInValues = {
  email: string;
  password: string;
};

export type PasswordResetRequestValues = {
  email: string;
};

export type AuthMessageResult = {
  message: string;
};

export type AuthProfile = {
  name?: string;
  email?: string;
  role?: "admin" | "employee" | string;
};

export type UpdateProfileValues = {
  name: string;
  email: string;
  role: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
