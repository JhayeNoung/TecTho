import React from 'react'
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Input, Button, HStack, Fieldset, Stack } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import { useUserStore } from '@/context/useUserStore';
import { logUserError } from '@/services/log-error';
import AlertMessage from './AlertMessage';
import apiMovie from "@/services/api-movie";

const schemaKey = z.object({
  verificationKey: z.number().max(99999, "Your key is 5 digit number serie.")
});

type Key = z.infer<typeof schemaKey>;

function UserVerification() {
  const { register, handleSubmit, formState: { errors } } = useForm<Key>({ resolver: zodResolver(schemaKey) });
  const [alert, setAlert] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const user_payload = location.state?.payload;
  const { updateActions } = useUserStore();

  const onSubmit = async (payload: Key) => {
    setLoading(true);
    try {
      // sent back verification key
      await apiMovie.get(`/users/validation/mail?verificationKey=${payload.verificationKey}`)

      // register user
      await apiMovie.post("/users/create", user_payload)
      updateActions(["user-register"]);

      // route to registration
      setAlert("Email verified successfully. Redirecting to login...");
      setLoading(false);
      setTimeout(() => {
        navigate("/registration");
      }, 2000);
    }
    catch (error: any) {
      logUserError(error, setAlert);
      setLoading(false);
    }
  }
  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <Stack>
            <Fieldset.Legend>verification</Fieldset.Legend>
            <Fieldset.HelperText>
              Please provide the key sented to your email.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <Field label="Type the key">
              <Input id="verificationKey" {...register('verificationKey', { required: true, valueAsNumber: true })} type="verificationKey" placeholder="xxxxx" />
              {errors.verificationKey?.message && <p className="text-danger">{errors.verificationKey?.message}</p>}
            </Field>
          </Fieldset.Content>

          {loading ?
            <HStack>
              <Button disabled>
                Verify...
              </Button>

              <Button disabled>
                Abort
              </Button>
            </HStack>
            :
            <HStack>
              <Button type='submit'>
                Verify
              </Button>

              <NavLink to="/registration/register" end>
                <Button>
                  Abort
                </Button>
              </NavLink>
            </HStack>
          }
        </Fieldset.Root>
      </form >
    </>
  )
}

export default UserVerification