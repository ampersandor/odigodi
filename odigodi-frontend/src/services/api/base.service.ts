import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../../types';

export abstract class BaseApiService {
  protected readonly api: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || '') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  protected async get<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
    return response.data;
  }

  protected handleError(error: any): never {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
}