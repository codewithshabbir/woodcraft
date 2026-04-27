"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { StatusMessage } from "@/components/shared/status-message";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteEntity } from "@/services/admin/admin.service";

type DeletableEntity =
  | "customer"
  | "employee"
  | "order"
  | "supplier"
  | "rawMaterial"
  | "workLog"
  | "invoice"
  | "payment"
  | "expense";

export default function ConfirmDeleteDialog({
  itemId,
  entityLabel = "item",
  entityType,
  trigger,
  onDeleted,
}: {
  itemId: string;
  entityLabel?: string;
  entityType: DeletableEntity;
  trigger?: React.ReactNode;
  onDeleted?: () => void | Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteEntity(entityType, itemId);
      await onDeleted?.();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : `Could not delete ${entityLabel}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const heading = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ? trigger : <Button size="sm" variant="destructive">Delete</Button>}
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-[99998] bg-black/50" />

        <AlertDialogContent className="fixed left-1/2 top-1/2 z-[99999] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {heading}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>

          {error ? <StatusMessage type="error" message={error} className="mt-4" /> : null}

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <PrimaryButton variant="secondary">Cancel</PrimaryButton>
            </AlertDialogCancel>

            <AlertDialogAction asChild>
              <PrimaryButton variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </PrimaryButton>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
