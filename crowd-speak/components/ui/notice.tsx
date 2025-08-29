"use client";

import { useEffect, useState } from "react";

type NoticeProps = {
  message: string;
  autoHideMs?: number;
  onClose?: () => void;
};

export function Notice({ message, autoHideMs = 3000, onClose }: NoticeProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, autoHideMs);
    return () => clearTimeout(id);
  }, [autoHideMs, onClose]);

  if (!visible) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm bg-muted">
      <span>{message}</span>
      <button
        type="button"
        className="text-xs underline"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}

export default Notice;


