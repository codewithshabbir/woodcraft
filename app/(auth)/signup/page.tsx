"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { PrimaryFormField } from "@/components/shared/PrimaryFormField";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import { ROUTES } from "@/lib/constants/routes";
import { signUpSchema, SignUpFormValues } from "@/lib/schemas/signup.schema";
import { signUp } from "@/services/auth/auth.service";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSignUpSubmit = async (values: SignUpFormValues) => {
    setLoading(true);
    setSubmitError(null);

    try {
      await signUp({ name: values.name, email: values.email, password: values.password });
      router.push(`${ROUTES.auth.signin}?message=${encodeURIComponent("Account created successfully. You can sign in now.")}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Account could not be created.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
        <p className="text-sm text-muted-foreground">Start managing your woodcraft projects</p>
      </div>

      {submitError ? <StatusMessage type="error" message={submitError} /> : null}

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSignUpSubmit)}>
          <PrimaryFormField name="name" label="Full Name" placeholder="Enter your name" control={form.control} leftIcon={<User className="h-4 w-4" />} />
          <PrimaryFormField name="email" label="Email Address" placeholder="Enter your email" control={form.control} leftIcon={<Mail className="h-4 w-4" />} />
          <PrimaryFormField name="password" label="Password" type="password" placeholder="Enter your password" control={form.control} leftIcon={<Lock className="h-4 w-4" />} />
          <PrimaryFormField name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" control={form.control} leftIcon={<Lock className="h-4 w-4" />} />
          <PrimaryButton type="submit" className="w-full h-11 text-base" isLoading={loading}>Create Account</PrimaryButton>
        </form>
      </Form>

      <div className="h-px bg-border" />

      <p className="text-center text-sm text-muted-foreground">Already have an account? <Link href={ROUTES.auth.signin} className="font-medium text-primary hover:underline">Sign in</Link></p>
    </div>
  );
}
