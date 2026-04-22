"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Crown, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "complete" | "open" | "error">("loading");
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.status ?? "error");
        setCustomerEmail(data.customerEmail ?? null);
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-premium/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-premium" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-premium" />
              <h1 className="text-2xl font-bold text-foreground">Welcome to Premium</h1>
            </div>
            {customerEmail && (
              <p className="text-muted-foreground">
                A confirmation has been sent to <span className="text-foreground font-medium">{customerEmail}</span>.
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Your account has been upgraded. All premium features are now available.
            </p>
          </div>
          <Button
            className="w-full bg-premium text-premium-foreground hover:bg-premium/90"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Payment Incomplete</h1>
          <p className="text-muted-foreground text-sm">
            Your payment was not completed. You have not been charged.
          </p>
        </div>
        <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
