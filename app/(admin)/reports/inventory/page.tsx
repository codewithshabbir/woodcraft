"use client";

import { Boxes, ShieldAlert, TrendingDown, Warehouse } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const inventoryUsage = [
  { name: "Oak Wood", consumed: 82, remaining: "38 ft" },
  { name: "Pine Wood", consumed: 91, remaining: "10 ft" },
  { name: "Hardware Sets", consumed: 67, remaining: "18 sets" },
  { name: "Wood Polish", consumed: 88, remaining: "3 litre" },
];

export default function InventoryReportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Material usage, stock pressure, and reorder insight for workshop planning
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tracked Materials", val: 48, icon: Boxes, color: "text-primary" },
          { label: "Critical Alerts", val: 7, icon: ShieldAlert, color: "text-red-600" },
          { label: "Fast Moving Items", val: 12, icon: TrendingDown, color: "text-amber-600" },
          { label: "Inventory Value", val: "Rs. 11,40,000", icon: Warehouse, color: "text-sky-600" },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl border border-border shadow-sm hover:shadow-md transition">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.val}</h2>
              </div>
              <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Consumption Intensity</CardTitle>
            <CardDescription>Highest-use materials during active production cycles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {inventoryUsage.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">Remaining: {item.remaining}</p>
                  </div>
                  <span className="font-bold text-primary">{item.consumed}%</span>
                </div>
                <Progress value={item.consumed} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Notes</CardTitle>
            <CardDescription>Key observations from current stock movement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Finishing consumables are depleting faster than structural wood inventory.",
              "Pine Wood has crossed the reorder threshold and may block new low-budget orders.",
              "Hardware sets still support current order volume but need replenishment within the week.",
              "Oak usage remains high due to premium custom furniture demand.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
