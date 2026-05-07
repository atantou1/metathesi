"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef } from "react";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  ({ onSuccess, onExpire, onError }, ref) => {
    return (
      <Turnstile
        ref={ref}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
        options={{
            appearance: "execute", // invisible
        }}
      />
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
