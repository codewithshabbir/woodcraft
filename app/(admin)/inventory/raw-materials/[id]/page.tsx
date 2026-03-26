import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RawMaterialViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const material = {
    id,
    name: "Teak Wood",
    type: "Wood",
    unit: "Cubic Feet",
    costPerUnit: 2500,
    stock: 120,
    threshold: 50,
    supplier: {
      name: "ABC Traders",
      contact: "+92 300 1234567",
      location: "Karachi, Pakistan",
    },
    createdAt: "12 Mar 2026",
    updatedAt: "20 Mar 2026",
    notes: "High quality imported wood for premium furniture. Store in dry conditions.",
  };

  const isOutOfStock = material.stock === 0;
  const isLowStock = material.stock <= material.threshold && material.stock > 0;

  const statusText = isOutOfStock
    ? "Out of Stock"
    : isLowStock
    ? "Low Stock"
    : "In Stock";

  const statusColor = isOutOfStock
    ? "bg-red-100 text-red-700"
    : isLowStock
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
            • {material.name}
          </p>
        </div>

        <Link href="/inventory/raw-materials">
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
              <InfoBlock label="Type" value={material.type} />
              <InfoBlock label="Unit" value={material.unit} />
              <InfoBlock
                label="Cost"
                value={`Rs. ${material.costPerUnit.toLocaleString()}`}
              />

              <div className="space-y-1">
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

          {/* Supplier */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Supplier
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoBlock label="Name" value={material.supplier.name} />
              <InfoBlock label="Phone" value={material.supplier.contact} />
              <InfoBlock
                label="Location"
                value={material.supplier.location}
                className="sm:col-span-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Stock */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-4xl font-black text-foreground">
                {material.stock}{" "}
                <span className="text-lg font-medium text-muted-foreground">
                  {material.unit}
                </span>
              </h2>

              <div className="flex items-center justify-between mt-6 p-3 bg-muted/50 rounded-lg border border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Threshold
                </span>
                <span className="font-bold text-foreground">
                  {material.threshold}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {material.notes}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary/60" />
                <span>Created: <span className="font-medium text-foreground">{material.createdAt}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary/60" />
                <span>Updated: <span className="font-medium text-foreground">{material.updatedAt}</span></span>
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
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}