export const adminApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function fetchAdminApi(input: string, init?: RequestInit) {
  return fetch(`/api/admin-backend${input}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.headers ?? {})
    }
  });
}
