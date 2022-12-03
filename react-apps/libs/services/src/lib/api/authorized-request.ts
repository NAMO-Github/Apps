import axios, {
  AxiosDefaults,
  AxiosError,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { stringify } from 'query-string';
import { environment } from '@namo-workspace/environments';
import { tokenManager } from './token-manager';

export interface RequestError {
  statusCode: number;
  message: string;
}
export interface RequestResponse<T> {
  data: T;
  message?: string;
}
export interface Axios {
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };

  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = RequestResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
  get<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  delete<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  head<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  options<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  post<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  put<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patch<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  postForm<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  putForm<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patchForm<T = any, R = RequestResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

export interface MyAxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise;
  (url: string, config?: AxiosRequestConfig): AxiosPromise;
}

const authorizedRequest: MyAxiosInstance = axios.create({
  baseURL: environment.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    return stringify(params, { arrayFormat: 'separator' });
  },
});

authorizedRequest.interceptors.request.use((config: AxiosRequestConfig) => {
  const newConfig = { ...config };
  const { token } = tokenManager;
  if (newConfig.headers) {
    newConfig.headers['Authorization'] =
      token && token !== 'guest' ? `Bearer ${token}` : '';
  }
  return newConfig;
});

authorizedRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<RequestError>) => {
    if (error && error.response && error.response.status === 401) {
      tokenManager.onSessionExpire();
      tokenManager.doLogout();
    }
    throw error;
  }
);

export default authorizedRequest;
