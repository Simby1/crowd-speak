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
  deletePollAction: (formData: FormData) => Promise<void>;
}

export default function DeletePollButton({ pollId, deletePollAction }: DeletePollButtonProps) {
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
            onClick={() => {
              const formData = new FormData();
              formData.append("poll_id", pollId);
              deletePollAction(formData);
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
