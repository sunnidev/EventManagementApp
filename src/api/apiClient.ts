import axios from "axios"
import { useAuthStore } from "../store/useAuthStore"


const API_BASE_URL = "http://localhost:3000/api/vi"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

let authInterceptor: number | null = null

export function setAuthToken(token: string | null) {
    if (authInterceptor !== null) {
        api.interceptors.request.eject(authInterceptor)
    }
    if (token) {
        authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${token}`
            return config
        })
    } else {
        authInterceptor = null
    }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = []
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => (token));
    refreshSubscribers = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        if (error.response?.status == 401 && originalRequest.url !== `${API_BASE_URL}/auth/refresh` && !originalRequest._retry) {
            originalRequest._retry = true

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshToken = useAuthStore.getState().refreshToken
                    if (!refreshToken) {
                        throw new Error('no refresh token')
                    }
                    const { accessToken } = (await api.post("/auth/refresh", { refreshToken })).data;
                    useAuthStore.getState().setAccessToken(accessToken)
                    setAuthToken(accessToken);
                    onRefreshed(accessToken)

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return api(originalRequest)

                } catch (refresError) {
                    useAuthStore.getState().logout()
                    return Promise.reject(refresError)
                } finally {
                    isRefreshing = false
                }
            }
        }
    }
)

export const signup = async (data: {
    name: string,
    email: string,
    password: string
}) => (await api.post("/auth/signup", data)).data

export const login = async (data: {
    email: string,
    password: string
}) => (await api.post("/auth/login", data)).data

export const googleLogin = async (idToken: string 
) => (await api.post("/auth/google-login", idToken)).data