"use client";

import { PrimaryButton } from "@/components/shared/PrimaryButton";
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
import { useRouter } from "next/navigation";

export default function DeleteOrderDialog({
  orderId,
  trigger,
}: {
  orderId: string;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    console.log("Deleting:", orderId);
    router.refresh();
  };

  return (
    <AlertDialog>
      {/* ✅ CUSTOM TRIGGER SUPPORT */}
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 bg-black/50 z-[99998]" />

        <AlertDialogContent
          className="fixed z-[99999] 
                     top-1/2 left-1/2 
                     -translate-x-1/2 -translate-y-1/2
                     w-full max-w-md
                     bg-white p-6 rounded-lg shadow-xl"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            {/* CANCEL */}
            <AlertDialogCancel asChild>
              <PrimaryButton variant="secondary">Cancel</PrimaryButton>
            </AlertDialogCancel>

            {/* DELETE */}
            <AlertDialogAction asChild>
              <PrimaryButton variant="destructive" onClick={handleDelete}>
                Confirm Delete
              </PrimaryButton>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
