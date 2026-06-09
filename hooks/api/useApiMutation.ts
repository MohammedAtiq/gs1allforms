"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api/client";

type HttpMethod = "post" | "put" | "patch" | "delete";

interface MutationPayload {
  id?: string | number;
  issue_id?: string | number;
  data?: unknown;
  [key: string]: unknown;
}

interface ApiMutationOptions {
  invalidateQueries?: unknown[];
  config?: object;
  onSuccess?: (data: unknown, variables: MutationPayload) => void;
  onError?: (error: Error, variables: MutationPayload) => void;
}

/**
 * useApiMutation(method, endpoint, options?)
 *
 * Supports dynamic :id replacement in endpoint URL.
 *
 * @example
 * // POST
 * const { mutateAsync: submitForm, isPending } = useApiMutation("post", API_ENDPOINTS.SUBMIT_FORM);
 * await submitForm({ companyName: "ACME", email: "a@b.com" });
 *
 * // DELETE with dynamic :id
 * const { mutateAsync: deleteDoc } = useApiMutation("delete", API_ENDPOINTS.DELETE_DOCUMENT);
 * await deleteDoc({ id: 5 });
 *
 * // PUT with separate id and data
 * const { mutateAsync: updateForm } = useApiMutation("put", API_ENDPOINTS.UPDATE_FORM);
 * await updateForm({ id: 3, data: { companyName: "New Name" } });
 */
export function useApiMutation(
  method: HttpMethod,
  endpoint: string,
  options: ApiMutationOptions = {}
) {
  const queryClient = useQueryClient();
  const { invalidateQueries, config = {}, onSuccess, onError } = options;

  return useMutation<unknown, Error, MutationPayload>({
    mutationFn: async (payload) => {
      // Replace :id or :issue_id in URL dynamically
      let finalEndpoint = endpoint;
      const routeId = payload?.id ?? payload?.issue_id;
      if (routeId != null) {
        finalEndpoint = finalEndpoint
          .replace(":id", String(routeId))
          .replace(":issue_id", String(routeId));
      }

      // For PUT/PATCH — if payload has .data field, use that as body
      let requestData: unknown = payload;
      if (payload?.data && (method === "put" || method === "patch")) {
        requestData = payload.data;
      } else if (method === "delete") {
        requestData = null;
      }

      switch (method) {
        case "post":   return apiService.post(finalEndpoint, requestData, config);
        case "put":    return apiService.put(finalEndpoint, requestData, config);
        case "patch":  return apiService.patch(finalEndpoint, requestData, config);
        case "delete": return apiService.delete(finalEndpoint, config);
      }
    },

    onSuccess: (data, variables) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: invalidateQueries });
      }
      onSuccess?.(data, variables);
    },

    onError: (error, variables) => {
      onError?.(error, variables);
    },
  });
}
