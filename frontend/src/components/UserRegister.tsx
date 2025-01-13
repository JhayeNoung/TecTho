import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { Input, Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import apiMovie from "@/services/api-movie";
import AlertMessage from "./AlertMessage";

const schemaUser = z.object({
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

type User = z.infer<typeof schemaUser>;

export default function UserRegister() {
    const { register, handleSubmit, formState: { errors } } = useForm<User>({ resolver: zodResolver(schemaUser) });
    const [alert, setAlert] = useState("");

    const onSubmit = async (payload: User) => {
        setAlert("");
        apiMovie
            .post("/users", payload)
            .then(() => {
                setAlert("User registered successfully");
                window.dispatchEvent(new Event("user-register")); // Dispatch event on successful register
            })
            .catch(error => {
                switch (error.status) {
                    case 404:
                        setAlert(error.message);
                        break;
                    case 401:
                    case 400:
                    case 403:
                        setAlert(error.response.data);
                        break;
                    case 500:
                        setAlert(error.message);
                        break;
                    default:
                        window.alert("An unexpected error occurred");
                }
            })
    };

    return (
        <>
            {alert && <AlertMessage message={alert} />}

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel htmlFor="name">Username</FormLabel>
                    <Input id="name" {...register('name', { required: true })} type="text" placeholder="name" />
                    {errors.name?.message && <p className="text-danger">{errors.name?.message}</p>}
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" {...register('email', { required: true })} type="email" placeholder="email" />
                    {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input id="password" {...register('password', { required: true })} type="password" placeholder="password" />
                    {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
                </FormControl>

                <Button type='submit'>
                    Register
                </Button>
            </form>

            <NavLink to=".." end>
                Back to login.
            </NavLink>
        </>
    )
}

// Note on NavLink "to" value:
// Using root "/" prefix, to="/registration", infront of path name is also Ok to go back to "~/registration"