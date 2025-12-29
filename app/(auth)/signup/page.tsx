"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { WOODCRAFT_SIGNIN } from "@/routes/Route";
import {
  signUpSchema,
  SignUpFormValues,
} from "@/lib/schemas/signup.schema";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    setLoading(true);

    try {
      // ❗ confirmPassword backend ko nahi bhejna
      const { confirmPassword, ...payload } = values;

      console.log("SIGNUP PAYLOAD:", payload);
      console.log(payload);

      // await api.signUp(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign up to start managing your woodcraft projects
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSignUpSubmit)}
        >
          <PrimaryFormField
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            control={form.control}
            leftIcon={<User className="h-4 w-4" />}
          />

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

          <PrimaryFormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            control={form.control}
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <PrimaryButton
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Create Account
          </PrimaryButton>
        </form>
      </Form>

      {/* Footer */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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