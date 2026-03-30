import { Calculator, Hammer, Layers3, ReceiptText } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/format";

type EstimationSummaryCardsProps = {
  materialSubtotal: number
  laborSubtotal: number
  unitEstimate: number
  totalEstimate: number
}

export function EstimationSummaryCards({
  materialSubtotal,
  laborSubtotal,
  unitEstimate,
  totalEstimate,
}: EstimationSummaryCardsProps) {
  const summaryCards = [
    {
      label: "Materials Cost",
      value: `Rs. ${formatNumber(materialSubtotal)}`,
      icon: Layers3,
      color: "text-amber-700",
    },
    {
      label: "Labor Cost",
      value: `Rs. ${formatNumber(laborSubtotal)}`,
      icon: Hammer,
      color: "text-sky-700",
    },
    {
      label: "Unit Estimate",
      value: `Rs. ${formatNumber(Math.round(unitEstimate))}`,
      icon: Calculator,
      color: "text-primary",
    },
    {
      label: "Project Total",
      value: `Rs. ${formatNumber(Math.round(totalEstimate))}`,
      icon: ReceiptText,
      color: "text-emerald-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((item) => (
        <Card key={item.label} className="rounded-xl border border-border shadow-sm transition hover:shadow-md">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
              <h2 className={cn("mt-1 text-2xl font-bold", item.color)}>{item.value}</h2>
            </div>
            <item.icon className={cn("h-8 w-8 opacity-20", item.color)} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}