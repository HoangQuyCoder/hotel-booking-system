import type { AxiosResponse } from "axios";

export async function apiCall<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<T> {
  const res = await promise;
  return res.data;
}
