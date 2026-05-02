import { getCookie } from '../utils/cookies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildUrl = (endpoint: string) =>
    `${BASE_URL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;


export async function fetcher<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getCookie('token');

    const res = await fetch(buildUrl(endpoint), {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    let data: any = null;

    try {
        data = await res.json();
    } catch {
        // no JSON response (ignore safely)
    }


    if (res.status === 401) {
        document.cookie = "token=; Max-Age=0";
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        throw new Error(data?.message || res.statusText || 'Request failed');
    }

    return data as T;
}


export const api = {
    get: <T>(endpoint: string) =>
        fetcher<T>(endpoint),

    post: <T>(endpoint: string, body?: any) =>
        fetcher<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(endpoint: string, body?: any) =>
        fetcher<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string) =>
        fetcher<T>(endpoint, {
            method: 'DELETE',
        }),
};