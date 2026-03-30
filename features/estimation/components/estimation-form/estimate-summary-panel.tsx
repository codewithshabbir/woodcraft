import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PrimaryButton } from "@/components/shared/PrimaryButton"
import { StatusMessage } from "@/components/shared/status-message"
import { formatNumber } from "@/lib/format";

type EstimateSummaryPanelProps = {
  complexityMultiplier: number
  materialSubtotal: number
  laborSubtotal: number
  adjustedBase: number
  overheadPercent: number
  profitPercent: number
  overheadAmount: number
  profitAmount: number
  quantity: number
  unitEstimate: number
  totalEstimate: number
  submitError: string | null
  submitSuccess: string | null
  isSubmitting: boolean
  onOverheadChange: (value: number) => void
  onProfitChange: (value: number) => void
  onSaveDraft: () => void
}

export function EstimateSummaryPanel({
  complexityMultiplier,
  materialSubtotal,
  laborSubtotal,
  adjustedBase,
  overheadPercent,
  profitPercent,
  overheadAmount,
  profitAmount,
  quantity,
  unitEstimate,
  totalEstimate,
  submitError,
  submitSuccess,
  isSubmitting,
  onOverheadChange,
  onProfitChange,
  onSaveDraft,
}: EstimateSummaryPanelProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Estimate Summary</CardTitle>
        <CardDescription>Live cost calculation based on selected materials and labor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submitSuccess ? <StatusMessage type="success" message={submitSuccess} /> : null}
        {submitError ? <StatusMessage type="error" message={submitError} /> : null}

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Complexity Multiplier
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">{complexityMultiplier.toFixed(2)}x</p>
        </div>

        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Materials subtotal</span>
            <span className="font-semibold">Rs. {formatNumber(materialSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Labor subtotal</span>
            <span className="font-semibold">Rs. {formatNumber(laborSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Adjusted base cost</span>
            <span className="font-semibold">Rs. {formatNumber(Math.round(adjustedBase))}</span>
          </div>
          <div className="grid gap-3 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Overhead %</label>
              <Input
                type="number"
                min={0}
                value={overheadPercent}
                onChange={(event) => onOverheadChange(Number(event.target.value))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Profit Margin %</label>
              <Input
                type="number"
                min={0}
                value={profitPercent}
                onChange={(event) => onProfitChange(Number(event.target.value))}
                className="h-11"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary-foreground/80">
            Final Total Estimate
          </p>
          <h2 className="mt-2 text-3xl font-bold">Rs. {formatNumber(Math.round(totalEstimate))}</h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {quantity} unit(s) x Rs. {formatNumber(Math.round(unitEstimate))} per unit
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Overhead amount</span>
            <span className="font-semibold">Rs. {formatNumber(Math.round(overheadAmount))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Profit amount</span>
            <span className="font-semibold">Rs. {formatNumber(Math.round(profitAmount))}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-medium">Recommended quotation</span>
            <span className="text-lg font-bold text-primary">Rs. {formatNumber(Math.round(totalEstimate))}</span>
          </div>
        </div>

        <PrimaryButton type="button" className="h-12 w-full text-sm font-semibold" onClick={onSaveDraft} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Estimation Draft"}
        </PrimaryButton>
      </CardContent>
    </Card>
  )
}