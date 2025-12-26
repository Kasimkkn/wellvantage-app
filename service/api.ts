import { API_CONFIG } from '@/constants/config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // No auth token needed anymore
        this.api.interceptors.request.use(
            async (config) => {
                // Remove token logic
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): string {
        if (error.response) {
            const message = (error.response.data as any)?.message;
            return message || 'An error occurred';
        } else if (error.request) {
            return 'Network error. Please check your connection.';
        } else {
            return error.message || 'An unexpected error occurred';
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.delete<T>(url, config);
        return response.data;
    }
}

export const apiService = new ApiService();