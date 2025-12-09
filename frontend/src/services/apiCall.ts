export async function apiCall<T>(promise: Promise<{ data: T }>): Promise<T> {
  const { data } = await promise;
  return data;
}
