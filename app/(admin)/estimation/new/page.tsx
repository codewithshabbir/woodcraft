import EstimationForm from "@/features/estimation/estimation-form";

export default function CreateEstimationPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Create Estimation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Calculate material and labor costs before confirming a new order
          </p>
        </div>
      </div>

      <EstimationForm />
    </div>
  );
}

