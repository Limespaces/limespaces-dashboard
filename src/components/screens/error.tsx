"use client";

import { IApiErrorResponse } from "@/api/API";
import { XCircleIcon } from "@phosphor-icons/react";

interface IApiErrorScreenProps {
  error: IApiErrorResponse["data"];
}

export function ApiErrorScreen(props: IApiErrorScreenProps) {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col gap-2 items-center justify-center">
      <XCircleIcon className="size-32 text-red-500" />
      <h1 className="text-3xl text-gray-400 font-bold">ERROR</h1>
      <p className="text-xl">{props.error.message}</p>
      <p className="text-sm font-mono text-gray-400">
        {props.error.error} ({props.error.statusCode})
      </p>
    </div>
  );
}
