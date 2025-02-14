import { useEffect } from "react";
import { useState } from "react";
import { AxiosInstance, CanceledError, AxiosRequestConfig } from "axios";

import { useMovieStore } from "@/context/useMovieStore";

export interface FetchResponse<T> {
    count: number;
    page_size: number;
    results: T[];
}

function useData<T>(axiosInstance: AxiosInstance, endpoint: string, requestConfig?: AxiosRequestConfig, dep?: any[]) {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const { actions } = useMovieStore();

    useEffect(() => {
        setLoading(true)

        const controller = new AbortController();

        axiosInstance
            .get<FetchResponse<T>>(endpoint, { signal: controller.signal, ...requestConfig })
            .then(response => {
                setData(response.data.results)
                setLoading(false)
            })
            .catch(error => {
                if (error instanceof CanceledError) return;
                setError(error)
                console.log(error)
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
    }, dep ? [...dep, actions] : [actions])

    return { data, error, loading }
}

export default useData