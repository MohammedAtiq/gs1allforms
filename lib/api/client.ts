import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// Response interceptor — global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  get: (url: string, params?: object) =>
    apiClient.get(url, { params }),

  post: (url: string, data?: unknown, config?: object) =>
    apiClient.post(url, data, config),

  put: (url: string, data?: unknown, config?: object) =>
    apiClient.put(url, data, config),

  patch: (url: string, data?: unknown, config?: object) =>
    apiClient.patch(url, data, config),

  delete: (url: string, config?: object) =>
    apiClient.delete(url, config),
};
