import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Token } from '../types/token.ts';

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

export const ApiClient = axios.create({
    baseURL: import.meta.env.VITE_ROOT_URL,
    withCredentials: true,
});

ApiClient.interceptors.request.use(authRequestInterceptor);

ApiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401) {
            // Very important to return a promise, otherwise react-query get error before this interceptor finished
            return new Promise((resolve, reject) => {
                axios<never, AxiosResponse<Token>>({
                    method: 'GET',
                    url: `${import.meta.env.VITE_ROOT_URL}api/Accounts/renew-tokens`,
                    withCredentials: true,
                    headers: {
                        Accept: 'application/json',
                    },
                })
                    .then((response) => {
                        sessionStorage.setItem('jwtToken', response.data.token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

                        ApiClient(originalRequest)
                            .then((response) => {
                                resolve(response);
                            })
                            .catch((error) => {
                                reject(error.response?.data);
                            });
                    })
                    .catch((error) => {
                        reject(error.response?.data);
                    });
            });
        } else {
            return Promise.reject(error.response?.data);
        }
    }
);
