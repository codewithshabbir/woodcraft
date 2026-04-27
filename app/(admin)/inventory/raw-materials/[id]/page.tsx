import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/helpers";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ROUTES } from "@/lib/constants/routes";
import { getRawMaterial } from "@/lib/server/admin-data";
import { formatNumber } from "@/lib/format";
import { auth } from "@/lib/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RawMaterialViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const session = await auth();
  const material = await getRawMaterial(id, { session });

  const isDepleted = material.quantity === 0;
  const isLowQuantity = material.quantity < material.threshold && material.quantity > 0;

  const statusText = isDepleted
    ? "Depleted"
    : isLowQuantity
    ? "Low Quantity"
    : "OK";

  const statusColor = isDepleted
    ? "bg-red-100 text-red-700"
    : isLowQuantity
    ? "bg-yellow-100 text-yellow-700"
    : "bg-green-100 text-green-700";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Raw Material Details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono font-bold text-foreground">
              {material.id}
            </span>{" "}
            - {material.name}
          </p>
        </div>

        <Link href={ROUTES.inventory.rawMaterials.root}>
          <PrimaryButton
            variant="outline"
            className="p-5 border-primary hover:border-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Raw Materials
          </PrimaryButton>
        </Link>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoBlock label="Unit" value={material.unit} />
              <InfoBlock
                label="Price per Unit"
                value={`Rs. ${formatNumber(material.pricePerUnit)}`}
              />

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </p>
                <span
                  className={cn(
                    "px-3 py-1 text-[11px] rounded-full font-bold uppercase tracking-tighter inline-block mt-0.5",
                    statusColor
                  )}
                >
                  {statusText}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Quantity */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Quantity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-4xl font-black text-foreground">
                {material.quantity}{" "}
                <span className="text-lg font-medium text-muted-foreground">
                  {material.unit}
                </span>
              </h2>

              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Threshold
                  </p>
                  <span className="font-bold text-foreground">
                    {material.threshold}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Reusable component with proper TypeScript types
function InfoBlock({ 
  label, 
  value, 
  className 
}: { 
  label: string; 
  value: string | React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}


