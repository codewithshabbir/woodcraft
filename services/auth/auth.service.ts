import { signIn as nextAuthSignIn } from "next-auth/react";

import type { AuthMessageResult, PasswordResetRequestValues, SignInValues } from "@/types/api/auth";

type CredentialsSignInResponse = {
  error?: string | null;
};

export const signIn = async (values: SignInValues): Promise<AuthMessageResult> => {
  const result = (await nextAuthSignIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  })) as CredentialsSignInResponse | undefined;

  if (!result || result.error) {
    throw new Error("Invalid email or password.");
  }

  return { message: "Signed in successfully." };
};

export const requestPasswordReset = async (values: PasswordResetRequestValues): Promise<AuthMessageResult> => {
  if (!values.email) {
    throw new Error("Email is required.");
  }

  return { message: "Password reset flow is not configured yet. Contact an administrator." };
};
