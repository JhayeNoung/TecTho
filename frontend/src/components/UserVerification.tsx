import React from 'react'
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, Button, HStack } from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import apiMovie from '@/services/api-movie';
import AlertMessage from './AlertMessage';

const schemaUser = z.object({
  verificationKey: z.number().max(99999, "Your key is 5 digit number serie.")
});

type IKey = z.infer<typeof schemaUser>;

function UserVerification() {
  const { register, handleSubmit, formState: { errors } } = useForm<IKey>({ resolver: zodResolver(schemaUser) });
  const [alert, setAlert] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const user_payload = location.state?.payload;
  console.log(user_payload)

  const onSubmit = async (payload: IKey) => {
    setLoading(true);
    try {
      // verify
      await apiMovie.get(`/users/validation/mail?verificationKey=${payload.verificationKey}`)

      // register
      await apiMovie.post("/users/create", user_payload)
      window.dispatchEvent(new Event("user-register")); // Dispatch event on successful register

      // route to registration
      setAlert("Email verified successfully. Redirecting to login...");
      setTimeout(() => {
        setLoading(false);
        navigate("/registration");
      }, 5000);
    }
    catch (error: any) {
      console.log(error);
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
      setLoading(false);
    }
  }
  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="verificationKey">Type the key below</FormLabel>
          <Input id="verificationKey" {...register('verificationKey', { required: true, valueAsNumber: true })} type="verificationKey" placeholder="xxxxx" />
          {errors.verificationKey?.message && <p className="text-danger">{errors.verificationKey?.message}</p>}
        </FormControl>

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

      </form>
    </>
  )
}

export default UserVerification