import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { Input, Button, Box, Fieldset, Stack } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import AlertMessage from "./AlertMessage";
import apiMovie from "@/services/api-movie";

const schemaUser = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20)
});

type User = z.infer<typeof schemaUser>;

export default function UserLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({ resolver: zodResolver(schemaUser) });
  const [alert, setAlert] = useState("")
  const navigate = useNavigate();

  const onSubmit = (payload: User) => {
    setAlert("");                                         // reset the alert message when submitting the form, which make sure duplicate value is not set, if duplicate value is set, alert state will be the same

    apiMovie
      .post("users/login", payload)
      .then((response) => {
        localStorage.setItem("token", response.data)      // set the token to local storage (session storage)
        localStorage.setItem("email", payload.email)      // set the email to local storage (session storage)
        window.dispatchEvent(new Event("token-change"));  // Dispatch a custom event to notify all listeners that the token has changed
        navigate('/registration/logout'); // Navigate to the logout page with email state
      })
      .catch(error => {
        // set the alert message based on the error status
        switch (error.status) {
          case 404:
            if (error.response.data.includes("No user found with this email.")) {
              setAlert("No user found with this email.");
            } else {
              setAlert("The requested resource was not found. status code: 404");
            }
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
        <p> If you haven’t registered yet, please <NavLink to="register" className="link" end>create an account.</NavLink></p>
      </Box>
    </>
  )
}
