"use client"
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

      // await api.signUp(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to Woodcraft
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          className="space-y-4"
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
          <div className="text-right text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <PrimaryButton type="submit" className="w-full" isLoading={loading}>
            Sign In
          </PrimaryButton>
        </form>
      </Form>

      {/* Footer */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
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
