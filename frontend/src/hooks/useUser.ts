import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";

import apiMovie, { CanceledError } from "@/services/api-movie";
import { useUserStore } from "@/context/useUserStore";
import { logActionError, logError } from "@/services/log-error";

// TYPES

export type User = {
    _id: string,
    name: string,
    email: string,
    isAdmin: boolean,
    password: string,
}

export const schemaLoginUser = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(20)
});

export type LoginUser = z.infer<typeof schemaLoginUser>;

export const schemaCreateUser = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(20, "Password must not exceed 20 characters.")
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter."
        )
        .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter."
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number."
        )
        .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character."
        ),
});

export type CreateUser = z.infer<typeof schemaCreateUser>;

export const schemaKey = z.object({
    verificationKey: z.number().max(99999, "Your key is 5 digit number serie.")
});

export type Key = z.infer<typeof schemaKey>;


// FUNCTIONS

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

export const useUserActions = () => {
    const { accessToken, updateActions, logout, updateAccessToken, updateEmail } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const user_payload = location.state?.payload;

    const handleDelete = async (user: User) => {
        setAlert("");
        setLoading(true);

        try {
            await apiMovie.delete(`/users/${user._id}`, {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            setLoading(false);
            updateActions(['user-delete']);
            window.alert("User deleted successfully");
        }
        catch (error: any) {
            setLoading(false);
            logActionError(error);
        }
    };

    const handleUpdate = async (user: User, payload: User) => {
        setAlert(""); // reset alert
        setLoading(true);

        try {
            await apiMovie.put(`/users/${user._id}`, payload, {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "application/json" // set content type to json
                }
            })
            setLoading(false);
            updateActions(["user-update"]);
            navigate('/registration/logout');
        }
        catch (error: any) {
            logActionError(error);
        }
    };

    const handleCreate = async (payload: CreateUser) => {
        setAlert(""); // reset alert
        try {
            // check validation and send mail
            setLoading(true);
            await apiMovie.post("/users/validation", payload);

            // route to verify page
            navigate("verification", { state: { payload } });
            setLoading(false);
        }
        catch (error: any) {
            logError(error, setAlert);
            setLoading(false);
        }
    }

    const handleVerify = async (payload: Key) => {
        setLoading(true);
        try {
            // sent back verification key
            await apiMovie.get(`/users/validation/mail?verificationKey=${payload.verificationKey}`)

            // register user
            await apiMovie.post("/users/create", user_payload)
            updateActions(["user-register"]);

            setLoading(false);

            // route to registration
            setAlert("Email verified successfully. Redirecting to login...");
            setTimeout(() => {
                navigate("/registration");
            }, 2000);
        }
        catch (error: any) {
            setLoading(false);
            logError(error, setAlert);
        }
    }

    const handleLogin = async (payload: LoginUser) => {
        setAlert("");
        setLoading(true);

        try {
            const response = await apiMovie.post("/users/login", payload, { withCredentials: true });
            const { accessToken } = response.data;
            setLoading(false);

            updateAccessToken(accessToken);
            updateEmail(payload.email);
            navigate('/registration/logout'); // redirect to the logout page
        }
        catch (error: any) {
            setLoading(false);
            logError(error, setAlert);
        }
    }

    const handleLogout = async () => {
        setAlert("");
        try {
            await apiMovie.post('/users/logout', null, { withCredentials: true }); // clear refresh tokken in cookies
            logout(); // clear the token and email from the state (or in-memory)
        }
        catch (error: any) {
            logActionError(error);
        }
    }

    return { loading, alert, handleDelete, handleUpdate, handleLogout, handleLogin, handleCreate, handleVerify}
}