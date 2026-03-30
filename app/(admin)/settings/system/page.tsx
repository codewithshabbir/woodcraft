"use client";

import { BellRing, DatabaseZap, LockKeyhole, Save } from "lucide-react";

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

export default function SystemSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">System Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure workshop defaults, thresholds, and admin-level controls
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Rules</CardTitle>
            <CardDescription>Default behavior for material alerts and reorder levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Low Stock Threshold (%)"><Input type="number" className="h-11" defaultValue="25" /></Field>
            <Field label="Default Material Unit">
              <select className="h-11 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none">
                <option>Feet</option>
                <option>Sheets</option>
                <option>Litres</option>
                <option>Sets</option>
              </select>
            </Field>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Billing Defaults</CardTitle>
            <CardDescription>System-wide defaults for invoicing and payment recovery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Standard Profit Margin (%)"><Input type="number" className="h-11" defaultValue="15" /></Field>
            <Field label="Invoice Due Days"><Input type="number" className="h-11" defaultValue="7" /></Field>
            <Field label="Workshop Currency"><Input className="h-11" defaultValue="PKR (Rs.)" /></Field>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Notifications & Access</CardTitle>
            <CardDescription>Important admin settings for alerts and protection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Enable low-stock alerts", icon: BellRing, checked: true },
              { label: "Allow manual backup reminders", icon: DatabaseZap, checked: true },
              { label: "Restrict destructive actions to admin only", icon: LockKeyhole, checked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary"><item.icon className="h-4 w-4" /></div>
                  <span>{item.label}</span>
                </div>
                <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4" />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <PrimaryButton className="p-5"><Save className="h-4 w-4" />Save System Settings</PrimaryButton>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
