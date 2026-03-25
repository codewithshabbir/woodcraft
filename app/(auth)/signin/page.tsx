"use client";

import { Mail, Lock } from "lucide-react";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { useState } from "react";
import { SignInFormValues, signInSchema } from "@/lib/schemas/signin.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Signin() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignInSubmit = (values: SignInFormValues) => {
    setLoading(true);

    try {
      console.log("SIGNIN PAYLOAD:", values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Woodcraft
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit(handleSignInSubmit)}
        >
          <PrimaryFormField
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            control={form.control}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <PrimaryFormField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            control={form.control}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          {/* Forgot password */}
          <div className="flex justify-end text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <PrimaryButton
            type="submit"
            className="w-full h-11 text-base"
            isLoading={loading}
          >
            Sign In
          </PrimaryButton>
        </form>
      </Form>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}