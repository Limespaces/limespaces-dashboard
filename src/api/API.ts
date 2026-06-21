import { DashboardConfig } from "@/config";
import { auth } from "@/auth";
import axios, { AxiosInstance } from "axios";
import { EventSource } from "eventsource";

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
  private static _connector?: AxiosInstance;
  private static get connector(): AxiosInstance {
    if (!this._connector) {
      this._connector = axios.create({
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }

    this._connector.defaults.baseURL =
      DashboardConfig.addresses.orchestratorBaseUrl;

    return this._connector;
  }

  public static async get<ReturnType>(
    version: ApiVersion,
    path: string,
    throws: boolean = false,
  ): Promise<IApiResponse<ReturnType>> {
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

  private static async getSession() {
    if (typeof window !== "undefined") {
      const { getSession } = await import("next-auth/react");
      return await getSession();
    }

    return await auth();
  }

  private static async $call<ReturnType, BodyType>(
    method: "get" | "post" | "put" | "patch" | "delete",
    version: ApiVersion,
    path: string,
    body: BodyType,
    throws: boolean,
  ): Promise<IApiResponse<ReturnType>> {
    const session = await this.getSession();
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

  static getWsUrl(version: ApiVersion, path: string) {
    const wsBase = DashboardConfig.addresses.orchestratorBaseUrl?.replace(
      "http",
      "ws",
    );

    return `${wsBase}${wsBase?.endsWith("/") ? "" : "/"}v${version}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  static async SSE(version: ApiVersion, path: string) {
    const baseUrl = DashboardConfig.addresses.orchestratorBaseUrl;

    const session = await this.getSession();

    const es = new EventSource(
      `${baseUrl}${baseUrl?.endsWith("/") ? "" : "/"}v${version}${path.startsWith("/") ? "" : "/"}${path}`,
      {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }),
      },
    );

    return es;
  }
}
