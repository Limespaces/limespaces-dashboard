export interface IServerActionOkResult<T> {
  success: true;
  data: T;
}

export interface IServerActionErrorResult {
  success: false;
  error: Error;
}

export type IServerActionResult<T> =
  | IServerActionOkResult<T>
  | IServerActionErrorResult;

export type IServerActionHandler<HandlerDataArg, HandlerOkResultData> = (
  data: HandlerDataArg,
  resolve: {
    ok: (data: HandlerOkResultData) => void;
    error: (error: Error) => void;
  },
) => void;

export type IServerActionDispatcher<HandlerDataArg, HandlerOkResultData> = (
  data: HandlerDataArg,
) => Promise<IServerActionResult<HandlerOkResultData>>;

export function createServerAction<HandlerDataArg, HandlerOkResultData>(
  handler: IServerActionHandler<HandlerDataArg, HandlerOkResultData>,
): IServerActionDispatcher<HandlerDataArg, HandlerOkResultData> {
  return async (data: HandlerDataArg) => {
    "use server";

    const result = await new Promise<IServerActionResult<HandlerOkResultData>>(
      (res) => {
        const okHandler = (data: HandlerOkResultData) =>
          res({
            success: true,
            data: data,
          });

        const errorHandler = (error: Error) =>
          res({
            success: false,
            error: error,
          });

        handler(data, { ok: okHandler, error: errorHandler });
      },
    );

    return result;
  };
}
