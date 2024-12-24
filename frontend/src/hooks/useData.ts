import { useEffect } from "react";
import { useState } from "react";
import { AxiosInstance, CanceledError, AxiosRequestConfig } from "axios";

type Error = {
    message: string
}

function useData<T>(axiosInstance: AxiosInstance, endpoint: string, requestConfig?: AxiosRequestConfig, dep?: any[]){
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<Error>({message: ""});
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        const controller = new AbortController();
        axiosInstance
        .get<T[]>(endpoint, {signal: controller.signal, ...requestConfig})
        .then(response=>{
            setData(response.data)
            console.log(response.data)
            setLoading(false)
        })
        .catch(error=>{
            if(error instanceof CanceledError) return;
            setError(error)
            console.log(error)
            setLoading(false)
        })
        return ()=>controller.abort()
    }, dep ? [...dep] : [])

    return { data, error , loading }
}

export default useData