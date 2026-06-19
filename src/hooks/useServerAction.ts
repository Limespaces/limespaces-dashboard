import { IServerActionDispatcher, IServerActionResult } from "@/api/actions";
import { useState } from "react";

export function useServerAction<HandlerDataArg, HandlerOkResultData>(
  dispatcher: IServerActionDispatcher<HandlerDataArg, HandlerOkResultData>,
  events?: {
    onError?: (error: Error) => void;
    onSuccess?: (data: HandlerOkResultData) => void;
  },
): {
  isLoading: boolean;
  result: IServerActionResult<HandlerOkResultData> | null;
  dispatch: (data: HandlerDataArg) => void;
} {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] =
    useState<IServerActionResult<HandlerOkResultData> | null>(null);

  const dispatch = async (data: HandlerDataArg) => {
    setIsLoading(true);
    setResult(null);

    const result = await dispatcher(data);
    setIsLoading(false);
    setResult(result);

    if (result.success) {
      if (events && events.onSuccess) events.onSuccess(result.data);
    } else {
      if (events && events.onError) events.onError(result.error);
    }
  };

  return { isLoading, result, dispatch };
}
