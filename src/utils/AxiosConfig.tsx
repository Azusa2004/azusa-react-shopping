import { message } from "antd";
import axios from "axios";

const instance = axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL,
    // timeout: 5000,
    baseURL: '/api',
})

instance.interceptors.response.use((res) => {
    return res.data
}, (error) => {
    if (error.status == 401) {
        message.error('登录过期')
        setTimeout(() => {
            localStorage.removeItem('userToken')
            location.href = '/Login'
        }, 2000)

    }
    return Promise.reject(error.message)
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('userToken')
    return config;
})

interface IResponse {
    code: number,
    message: string,
    data: any;
}

export const httpGet = (url: string, data?: object): Promise<IResponse> => {
    return instance({
        url,
        method: 'GET',
        params: data
    })
}
export const httpPut = (url: string, data?: object): Promise<IResponse> => {
    return instance({
        url,
        method: 'PUT',
        data
    })
}
export const httpPost = (url: string, data?: object): Promise<IResponse> => {
    return instance({
        url,
        method: 'POST',
        data
    })
}
export const httpDelete = (url: string, data?: object): Promise<IResponse> => {
    return instance({
        url,
        method: 'DELETE',
        params: data
    })
}