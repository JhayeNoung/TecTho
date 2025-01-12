import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Input, Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from "react-router-dom";

import apiMovie from "@/services/api-movie";
import AlertMessage from "./AlertMessage";

// all fields are optional, but if they are filled, they must meet the requirements
const schemaUser = z.object({
  _id: z.string().optional().or(z.literal('')),
  name: z.string().min(2).max(100).optional().or(z.literal('')), // min and max length for name
  email: z.string().min(3).max(255).email().optional().or(z.literal('')), // min, max, and email format for email
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character.")
    .optional().or(z.literal('')), // min, max, and patterns for password
});

type User = z.infer<typeof schemaUser>;

export default function UserUpdate() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>({ resolver: zodResolver(schemaUser) });
  const [alert, setAlert] = useState("");
  const storedToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const location = useLocation(); // get "state" from NavLink Edit component of UserAction
  const user = location.state?.user; // get user data from "state"

  const onSubmit = async (payload: User) => {
    setAlert(""); // reset alert
    apiMovie
      .put(`/users/${user._id}`, payload, {
        headers: {
          Authorization: `${storedToken}`,
          "Content-Type": "application/json" // set content type to json
        }
      })
      .then(() => {
        window.dispatchEvent(new Event("user-update")); // Dispatch event on successful update
        navigate('/registeration/logout'); // Navigate to the logout page after submission
      })
      .catch(error => {
        console.log(error);
        switch (error.status) {
          case 404:
            window.alert(error.message);
            break;
          case 401:
          case 400:
          case 403:
            window.alert(error.response.data);
            break;
          case 500:
            window.alert(error.message);
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
          <Input id="name" {...register('name')} type="text" placeholder={`${user.name}`} />
          {errors.name?.message && <p className="text-danger">{errors.name?.message}</p>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" {...register('email')} type="email" placeholder={`${user.email}`} />
          {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input id="password" {...register('password')} type="password" placeholder="(Leave blank if no change)" />
          {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
        </FormControl>

        <Button type='submit'>
          Update
        </Button>
      </form>
    </>
  );
}