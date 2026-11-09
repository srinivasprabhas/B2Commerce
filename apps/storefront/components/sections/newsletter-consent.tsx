"use client";

import { Checkbox } from "@b2c/ui/components/checkbox";
import { Label } from "@b2c/ui/components/label";
import { cn } from "@/lib/utils";

export function NewsletterConsent({
  checked,
  onCheckedChange,
  disabled,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Label className={cn("flex cursor-pointer items-start gap-2 text-left font-normal", className)}>
      <Checkbox
        name="marketingConsent"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled}
        className="mt-0.5 shrink-0"
      />
      <span className="text-sm leading-snug opacity-80">
        I agree to receive marketing emails and accept the privacy policy. You can unsubscribe at any time.
      </span>
    </Label>
  );
}
