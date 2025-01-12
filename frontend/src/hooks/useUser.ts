import apiMovie from "@/services/api-movie";
import { useEffect, useState } from "react";
import { CanceledError } from "@/services/api-movie";

export type User = {
    _id: string,
    name: string,
    email: string,
    isAdmin: boolean,
}

export function useUser() {
    const [users, setUsers] = useState<User[]>([])
    const [error, setError] = useState()
    const [signal, setSignal] = useState(0);

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

        window.addEventListener("user-delete", () => setSignal(prev => prev + 1)); // Listen for user-delete event
        window.addEventListener("user-register", () => setSignal(prev => prev + 1)); // Listen for user-register event
        window.addEventListener("user-update", () => setSignal(prev => prev + 1)); // Listen for user-update event

        return () => {
            controller.abort();
            window.removeEventListener("user-delete", () => setSignal(prev => prev + 1));
            window.removeEventListener("user-register", () => setSignal(prev => prev + 1));
            window.removeEventListener("user-update", () => setSignal(prev => prev + 1));
        };

    }, [signal]);

    return { users, error }
}