import axios from "axios";
import {getCookiesItem} from "../utilities/getCookiesItem.ts";

export const ApiClient = () => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_ROOT_URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem("jwtToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor to refresh the JWT token if it's expired
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;
            const refreshToken = getCookiesItem("refreshToken");

            // If the error is a 401 and we have a refresh token, refresh the JWT token
            if (error.response.status === 401 && refreshToken) {

                get("api/Accounts/renew-tokens")
                    .then((response) => {
                        sessionStorage.setItem("jwtToken", response.token);

                        // Re-run the original request that was intercepted
                        originalRequest.headers.Authorization = `Bearer ${response.token}`;
                        api(originalRequest)
                            .then((response) => {
                                return response.data;
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((err) => {
                        // TODO:  If there is an error refreshing the token, log out the user
                        console.log(err);
                    });
            }

            // Return the original error if we can't handle it
            return Promise.reject(error);
        }
    );

    const get = async (path: string) => {
        const response = await api.get(path);
        return response.data;
    };

    const post = async (path: string, data: object) => {
        const response = await api.post(path, data);
        return response.data;
    };

    const put = async (path: string, data: object) => {
        const response = await api.put(path, data);
        return response.data;
    };

    const del = async (path: string) => {
        return await api.delete(path);
    };

    return {
        get,
        post,
        put,
        del,
    };
};
