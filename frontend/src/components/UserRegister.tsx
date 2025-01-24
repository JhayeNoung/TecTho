import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { Input, Button, Fieldset, Stack, Box } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import apiMovie from "@/services/api-movie";
import AlertMessage from "./AlertMessage";
import { logUserError } from "@/services/log-error";

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState("");

    const onSubmit = async (payload: User) => {
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
            logUserError(error, setAlert);
            setLoading(false);
        }
    };

    return (
        <>
            {alert && <AlertMessage message={alert} />}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset.Root>
                    <Stack>
                        <Fieldset.Legend>Registration Form</Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please provide your contact details below.
                        </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                        <Field label="Name">
                            <Input id="name" {...register('name', { required: true })} type="text" placeholder="name" />
                            {errors.name?.message && <p className="text-danger">{errors.name?.message}</p>}
                        </Field>

                        <Field label="Email">
                            <Input id="email" {...register('email', { required: true })} type="email" placeholder="email" />
                            {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
                        </Field>

                        <Field label="Password">
                            <Input id="password" {...register('password', { required: true })} type="password" placeholder="password" />
                            {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
                        </Field>

                    </Fieldset.Content>

                    {loading ?
                        <Button disabled>
                            Register...
                        </Button>
                        :
                        <Button type='submit'>
                            Register
                        </Button>
                    }

                </Fieldset.Root >
            </form>

            <Box paddingTop={3}>
                <NavLink to=".." className="link" end>
                    Retrun to Login.
                </NavLink>
            </Box>

        </>
    )
}

// Note on NavLink "to" value:
// Using root "/" prefix, to="/registration", infront of path name is also Ok to go back to "~/registration"