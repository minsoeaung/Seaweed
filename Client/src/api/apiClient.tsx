import axios, {InternalAxiosRequestConfig} from "axios";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}

// TODO: improve about "never" -> "ApiClient.post<never, AuthResponse>"
export const ApiClient = axios.create({
    baseURL: import.meta.env.VITE_ROOT_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
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
                axios({
                    method: "GET",
                    url: `${import.meta.env.VITE_ROOT_URL}api/Accounts/renew-tokens`,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    }
                }).then((response) => {
                    sessionStorage.setItem("jwtToken", response.data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

                    ApiClient(originalRequest)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        })
                }).catch(error => {
                    reject(error);
                })
            })
        } else {
            return Promise.reject(error);
        }
    }
);

