"use client";

import { Mail, Lock } from "lucide-react";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFormValues, signInSchema } from "@/lib/schemas/signin.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/lib/constants/routes";
import { signIn } from "@/services/auth/auth.service";
import { Suspense } from "react";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSignInSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    setSubmitError(null);

    try {
      await signIn(values);
      router.push(`${ROUTES.dashboard.overview}?message=${encodeURIComponent("Signed in successfully.")}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue to Woodcraft</p>
      </div>

      {message ? <StatusMessage type="success" message={message} /> : null}
      {submitError ? <StatusMessage type="error" message={submitError} /> : null}

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSignInSubmit)}>
          <PrimaryFormField name="email" label="Email Address" placeholder="Enter your email" control={form.control} leftIcon={<Mail className="h-4 w-4" />} />
          <PrimaryFormField name="password" label="Password" type="password" placeholder="Enter your password" control={form.control} leftIcon={<Lock className="h-4 w-4" />} />

          <div className="flex justify-end text-sm">
            <Link href={ROUTES.auth.forgotPassword} className="text-primary hover:underline">Forgot password?</Link>
          </div>

          <PrimaryButton type="submit" className="w-full h-11 text-base" isLoading={loading}>Sign In</PrimaryButton>
        </form>
      </Form>

      <div className="h-px bg-border" />

      <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href={ROUTES.auth.signup} className="font-medium text-primary hover:underline">Create one</Link></p>
    </div>
  );
}