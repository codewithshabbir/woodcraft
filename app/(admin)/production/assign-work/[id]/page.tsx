import Link from "next/link";
import { Calendar, ClipboardList, Pencil, User } from "lucide-react";

import InfoPair from "@/features/admin/components/shared/info-pair";
import PageHeader from "@/features/admin/components/shared/page-header";
import StatusBadge from "@/features/admin/components/shared/status-badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";

export default async function AssignWorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = {
    id,
    worker: "Ali Raza",
    orderId: "ORD-104",
    material: "Oak Wood Panels",
    quantity: 10,
    deadline: "2026-04-05",
    status: "In Progress",
    priority: "High",
    notes: "Finish frame assembly first, then move to edge polish and fitting.",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Assigned Work Details"
        description={`${task.id} - ${task.worker}`}
        backHref={ROUTES.production.assignWork.root}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Task Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <InfoPair label="Order" value={task.orderId} />
              <InfoPair label="Material" value={task.material} />
              <InfoPair label="Quantity" value={task.quantity} />
              <InfoPair label="Priority" value={task.priority} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{task.notes}</CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Assigned Worker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoPair label="Worker" value={task.worker} />
              <InfoPair
                label="Status"
                value={
                  <StatusBadge
                    label={task.status}
                    toneClassName={
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }
                  />
                }
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoPair label="Deadline" value={task.deadline} />
            </CardContent>
          </Card>

          <Link href={ROUTES.production.assignWork.edit(task.id)}>
            <PrimaryButton className="w-full p-5">
              <Pencil className="h-4 w-4" />
              Edit Task
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

