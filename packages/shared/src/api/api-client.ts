import axios, { AxiosInstance } from 'axios';

/**
 * Platform-agnostic API client configuration
 * Works in both Next.js and React Native environments
 */

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
}

/**
 * Create a configured axios instance for API calls
 * Automatically includes credentials for web, handles JSON, and provides error parsing
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
    const instance = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout || 30000,
        headers: {
            'Content-Type': 'application/json',
        },
        // Include credentials for web (cookies)
        withCredentials: true,
    });

    // Request interceptor - can add auth tokens here
    instance.interceptors.request.use(
        (config) => {
            // Future: Add auth token from storage
            // const token = getAuthToken();
            // if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor - standardize error handling
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                // Server responded with error status
                const apiError = {
                    status: error.response.status,
                    message: error.response.data?.error || error.message,
                    details: error.response.data?.details,
                };
                return Promise.reject(apiError);
            } else if (error.request) {
                // Request made but no response
                return Promise.reject({
                    status: 0,
                    message: 'Network error - no response from server',
                });
            } else {
                // Error setting up request
                return Promise.reject({
                    status: 0,
                    message: error.message,
                });
            }
        }
    );

    return instance;
}

/**
 * Get the API base URL from environment variables
 * Supports both Next.js (NEXT_PUBLIC_) and Expo (EXPO_PUBLIC_)
 */
export function getApiBaseUrl(): string {
    // Next.js environment variable
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Expo environment variable
    if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // Default fallback for development
    return 'http://localhost:3000';
}

/**
 * Default API client instance
 * Use this for all API calls
 */
export const apiClient = createApiClient({
    baseURL: getApiBaseUrl(),
});
