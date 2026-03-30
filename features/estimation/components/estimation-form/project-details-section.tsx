import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { EstimationFormValues } from "@/features/estimation/schemas/estimation.schema"

type ProjectDetailsSectionProps = {
  values: EstimationFormValues
  onFieldChange: <K extends keyof EstimationFormValues>(key: K, value: EstimationFormValues[K]) => void
}

export function ProjectDetailsSection({ values, onFieldChange }: ProjectDetailsSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Define the order context before calculating the estimate</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Title</label>
          <Input
            value={values.projectTitle}
            onChange={(event) => onFieldChange("projectTitle", event.target.value)}
            className="h-11"
            placeholder="6-seater dining set"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Customer Name</label>
          <Input
            value={values.customerName}
            onChange={(event) => onFieldChange("customerName", event.target.value)}
            className="h-11"
            placeholder="Client for quotation"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Project Type</label>
          <select
            value={values.projectType}
            onChange={(event) => onFieldChange("projectType", event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
          >
            <option value="custom-furniture">Custom Furniture</option>
            <option value="repair-work">Repair Work</option>
            <option value="interior-fitout">Interior Fit-Out</option>
            <option value="office-furniture">Office Furniture</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Units / Quantity</label>
          <Input
            type="number"
            min={1}
            value={values.quantity}
            onChange={(event) => onFieldChange("quantity", Number(event.target.value))}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Complexity Level</label>
          <select
            value={values.complexity}
            onChange={(event) => onFieldChange("complexity", event.target.value as EstimationFormValues["complexity"])}
            className="h-11 w-full rounded-md border border-border bg-muted px-3 text-sm outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Input
            value={values.notes ?? ""}
            onChange={(event) => onFieldChange("notes", event.target.value)}
            className="h-11"
            placeholder="Polish shade, carving, delivery, etc."
          />
        </div>
      </CardContent>
    </Card>
  )
}
