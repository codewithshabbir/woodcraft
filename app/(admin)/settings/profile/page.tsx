"use client";

import { KeyRound, Mail, ShieldCheck, UserCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage personal account information and sign-in preferences
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Account Profile</CardTitle>
            <CardDescription>Primary identity information for the logged-in admin</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name"><Input className="h-11" defaultValue="Muhammad Shabbir" /></Field>
            <Field label="Designation"><Input className="h-11" defaultValue="Workshop Administrator" /></Field>
            <Field label="Email"><Input className="h-11" defaultValue="admin@woodcraft.com" /></Field>
            <Field label="Phone Number"><Input className="h-11" defaultValue="+92 300 1122334" /></Field>
            <Field label="Workshop Address" className="md:col-span-2"><Input className="h-11" defaultValue="Industrial Area, Karachi" /></Field>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Password and access management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Current Password"><Input type="password" className="h-11" value="password123" readOnly /></Field>
              <Field label="New Password"><Input type="password" className="h-11" placeholder="Enter new password" /></Field>
              <Field label="Confirm Password"><Input type="password" className="h-11" placeholder="Re-enter new password" /></Field>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-5">
              {[
                { title: "Profile Identity", text: "Visible across admin records and ownership logs.", icon: UserCircle2 },
                { title: "Contact Recovery", text: "Email and phone support account recovery actions later.", icon: Mail },
                { title: "Security Status", text: "Use strong passwords for admin-only billing and settings pages.", icon: ShieldCheck },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary"><item.icon className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton className="p-5"><KeyRound className="h-4 w-4" />Save Profile Changes</PrimaryButton>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
