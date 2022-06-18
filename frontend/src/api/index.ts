import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:5001',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);

    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    // Do something with response data
    if (response.status === 201) {
        // Do something
    }

    if (response.status === 202) {
        // Do something
    }

    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 400) {
        // Do something
    }

    if (error.response && error.response.status === 500) {
        // Do something
    }

    console.error(`[response error] [${JSON.stringify(error)}]`);

    return Promise.reject(error);
};

api.interceptors.response.use(onResponse, onResponseError);
api.interceptors.request.use(onRequest, onRequestError);

export default api;
