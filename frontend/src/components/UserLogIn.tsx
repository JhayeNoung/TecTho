import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router";
import { Input, Button, Box, Fieldset, Stack } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import AlertMessage from "./AlertMessage";
import apiMovie from "@/services/api-movie";
import { useAuth } from "@/context/AuthContext";
import { handleError } from "@/services/handle-error";

const schemaUser = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20)
});

type User = z.infer<typeof schemaUser>;

export default function UserLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({ resolver: zodResolver(schemaUser) });
  const [alert, setAlert] = useState("")
  const navigate = useNavigate();
  const { updateToken, updateEmail } = useAuth();

  const onSubmit = async (payload: User) => {
    setAlert(""); // reset the alert message when submitting the form, which make sure duplicate value is not set, if duplicate value is set, alert state will be the same

    try {
      const response = await apiMovie.post("users/login", payload);
      updateToken(response.data);
      updateEmail(payload.email);
      navigate('/registration/logout'); // redirect to the logout page
    }
    catch (error: any) {
      handleError(error, setAlert);
    }
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      {/* Logging In Form */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Fieldset.Root>
          <Stack>
            <Fieldset.Legend>Welcome, Ma'am/Sir...</Fieldset.Legend>
            <Fieldset.HelperText>
              Please provide your email and password below.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>

            <Field label="Email">
              <Input id="email" {...register('email', { required: true })} type="email" placeholder="email" />
              {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
            </Field>

            <Field label="Password">
              <Input id="password" {...register('password', { required: true })} type="password" placeholder="password" />
              {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
            </Field>

          </Fieldset.Content>
          <Button type='submit'>
            Login
          </Button>
        </Fieldset.Root>
      </form>

      {/* Sign Up Link */}
      <Box paddingTop={3}>
        <p> If you haven't registered yet, please <NavLink to="register" className="link" end>create an account.</NavLink></p>
      </Box>
    </>
  )
}
