"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeletePollButtonProps {
  pollId: string;
  user: any; // Accept user prop as expected
  deletePollAction: (pollId: string) => Promise<{ success: boolean; error?: string }>;
}

export default function DeletePollButton({ pollId, user, deletePollAction }: DeletePollButtonProps) {
  // You can use the user prop for any client-side checks if needed
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="text-sm text-[#FF6347] hover:text-red-400 p-0 h-auto font-medium">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl bg-[#222222] border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete your poll.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deletePollAction(pollId);
              // Handle redirect or UI update in parent or via hook
            }}
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
