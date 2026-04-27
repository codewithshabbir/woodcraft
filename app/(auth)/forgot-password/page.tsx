"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { forgotPasswordSchema } from "@/lib/schemas/forgotpassword.schema";
import { requestPasswordReset } from "@/services/auth/auth.service";
import type { PasswordResetRequestValues } from "@/types/api/auth";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PasswordResetRequestValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (values: PasswordResetRequestValues) => {
    setLoading(true);
    setSubmitError(null);

    try {
      const result = await requestPasswordReset(values);
      setSuccessMessage(result.message);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Reset request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Forgot password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      {successMessage ? <StatusMessage type="success" message={successMessage} /> : null}
      {submitError ? <StatusMessage type="error" message={submitError} /> : null}

      {!successMessage ? (
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <PrimaryFormField name="email" label="Email Address" placeholder="Enter your email" control={form.control} leftIcon={<Mail className="h-4 w-4" />} />
            <PrimaryButton type="submit" className="w-full h-11 text-base" isLoading={loading} disabled={loading}>Send reset link</PrimaryButton>
          </form>
        </Form>
      ) : null}

      <div className="h-px bg-border" />

      <p className="text-center text-sm text-muted-foreground">Remember your password? <Link href={ROUTES.auth.signin} className="font-medium text-primary hover:underline">Sign in</Link></p>
    </div>
  );
}
