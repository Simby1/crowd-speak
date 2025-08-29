"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewPollOptions() {
  const [options, setOptions] = useState<string[]>(["", ""]);

  const update = (index: number, value: string) => {
    setOptions((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const add = () => setOptions((prev) => [...prev, ""]);
  const remove = (index: number) => setOptions((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {options.map((value, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input name="options[]" value={value} onChange={(e) => update(i, e.target.value)} placeholder={`Option ${i + 1}`} required={i < 2} />
          {options.length > 2 ? (
            <Button type="button" variant="ghost" onClick={() => remove(i)} aria-label={`Remove option ${i + 1}`}>
              Remove
            </Button>
          ) : null}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add}>
        Add option
      </Button>
    </div>
  );
}


