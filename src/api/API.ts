import { DashboardConfig } from "@/config";
import { auth } from "@/auth";
import axios, { AxiosInstance } from "axios";

export interface IApiErrorResponse {
  isOk: false;
  data: {
    statusCode: number;
    error: string;
    message: string;
  };
}

export interface IApiOkResponse<T> {
  isOk: true;
  data: T;
}

export type IApiResponse<T> = IApiErrorResponse | IApiOkResponse<T>;

export enum ApiVersion {
  v1 = "1",
}

export class API {
  private static connector: AxiosInstance = axios.create({
    baseURL: DashboardConfig.addresses.orchestratorBaseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  public static async get<ReturnType>(
    version: ApiVersion,
    path: string,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
    console.log(this.connector.defaults.baseURL);

    return await this.$call("get", version, path, null, throws);
  }

  public static async post<ReturnType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
    return await this.$call("post", version, path, body, throws);
  }

  public static async put<ReturnType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
    return await this.$call("put", version, path, body, throws);
  }

  public static async patch<ReturnType, BodyType>(
    version: ApiVersion,
    path: string,
    body: BodyType,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
    return await this.$call("patch", version, path, body, throws);
  }

  public static async delete<ReturnType>(
    version: ApiVersion,
    path: string,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
    return await this.$call("delete", version, path, null, throws);
  }

  private static async $call<ReturnType, BodyType>(
    method: "get" | "post" | "put" | "patch" | "delete",
    version: ApiVersion,
    path: string,
    body: BodyType,
    throws: boolean,
  ): Promise<IApiResponse<ReturnType>> {
    const session = await auth();
    const headers: Record<string, string> = {};

    if (session?.accessToken)
      headers["Authorization"] = `Bearer ${session.accessToken}`;

    const config = { headers };
    const response = await (
      ["post", "put", "patch"].includes(method)
        ? this.connector[method]<ReturnType>(
            this.$path(version, path),
            body,
            config,
          )
        : this.connector[method]<ReturnType>(this.$path(version, path), config)
    ).catch((e) => ({
      error: e.response,
    }));

    if ("error" in response) {
      const result = {
        isOk: false,
        data: response?.error?.data ?? {
          statusCode: -1,
          error: "UNKNOWN_ERROR",
          message: "Unknown error occurred.",
        },
      } as IApiErrorResponse;

      if (throws) return Promise.reject(result);
      else return result;
    }

    return {
      isOk: true,
      data: response.data,
    } as IApiOkResponse<ReturnType>;
  }

  private static $path(version: ApiVersion, path: string): string {
    return `v${version}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}
