"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { WOODCRAFT_SIGNIN } from "@/routes/Route";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/schemas/forgotpassword.schema";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);

    try {
      console.log("FORGOT PASSWORD PAYLOAD:", values);
      setSuccess(true);
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Forgot password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we’ll send you a reset link
        </p>
      </div>

      {/* Success State */}
      {success ? (
        <div className="rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground text-center">
          If an account exists with this email, a reset link has been sent.
        </div>
      ) : (
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <PrimaryFormField
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              control={form.control}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <PrimaryButton
              type="submit"
              className="w-full h-11 text-base"
              isLoading={loading}
              disabled={loading}
            >
              Send reset link
            </PrimaryButton>
          </form>
        </Form>
      )}

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={WOODCRAFT_SIGNIN}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}