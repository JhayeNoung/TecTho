import apiMovie, { CanceledError } from "@/services/api-movie";
import { useEffect, useState } from "react";

import { useUserStore } from "@/context/useUserStore";

export type User = {
    _id: string,
    name: string,
    email: string,
    isAdmin: boolean,
    password: string,
}

export function useUser() {
    const [users, setUsers] = useState<User[]>([])
    const [error, setError] = useState()
    const { actions } = useUserStore();

    useEffect(() => {
        const controller = new AbortController();

        apiMovie.get("/users", { signal: controller.signal })
            .then(renspone => {
                setUsers(renspone.data);
            })
            .catch(error => {
                if (error instanceof CanceledError) return;
                console.log(error);
                setError(error)
            });

        return () => {
            controller.abort();
        };

    }, [actions]);

    return { users, error }
}