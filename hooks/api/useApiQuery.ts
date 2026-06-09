"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiService } from "@/lib/api/client";

/**
 * useApiQuery(queryKey, endpoint, params?, options?)
 *
 * @example
 * const { data, isLoading, error, refetch } = useApiQuery(
 *   ["categories"],
 *   API_ENDPOINTS.GET_CATEGORIES
 * );
 *
 * // with params
 * const { data } = useApiQuery(
 *   ["form", id],
 *   API_ENDPOINTS.GET_FORM.replace(":id", id),
 *   { include: "details" }
 * );
 */
export function useApiQuery<TData = unknown>(
  queryKey: unknown[],
  endpoint: string,
  params?: object,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => apiService.get(endpoint, params) as Promise<TData>,
    ...options,
  });
}
