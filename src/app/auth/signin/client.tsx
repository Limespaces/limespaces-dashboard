"use client";

import { ProviderId } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface IRedirectProps {
  callbackUrl: string;
  method: ProviderId;
}

export function Redirect(props: IRedirectProps) {
  useEffect(() => {
    signIn(props.method, { redirectTo: props.callbackUrl });
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-green-50">
      <Spinner className="size-8 text-green-800" />
    </div>
  );
}
