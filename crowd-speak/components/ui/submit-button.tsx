"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending} aria-busy={pending} aria-live="polite">
      {pending ? "Please wait..." : children}
    </Button>
  );
}

export default SubmitButton;


