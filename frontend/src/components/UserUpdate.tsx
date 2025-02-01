import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Fieldset, Stack } from "@chakra-ui/react";
import { Field } from "./ui/field";

import apiMovie from "@/services/api-movie";
import AlertMessage from "./AlertMessage";
import { useUserStore } from "@/context/useUserStore";
import { logActionError } from "@/services/log-error";
import { User } from "@/hooks/useUser";

export default function UserUpdate() {
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const { accessToken, updateActions } = useUserStore();

  const onSubmit = async (payload: User) => {
    setAlert(""); // reset alert

    try {
      await apiMovie.put(`/users/${user._id}`, payload, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json" // set content type to json
        }
      })

      updateActions(["user-update"]);
      navigate('/registration/logout');
    }
    catch (error: any) {
      logActionError(error);
    }
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root>

          <Stack>
            <Fieldset.Legend>Update your details...</Fieldset.Legend>
            <Fieldset.HelperText>
              Please take your time ... have a greate day!
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field label="Name">
              <Input id="name" {...register('name')} type="text" placeholder={`${user.name}`} />
              {errors.name?.message && <p className="text-danger">{errors.name?.message}</p>}
            </Field>

            <Field label="Email">
              <Input id="email" {...register('email')} type="email" placeholder={`${user.email}`} />
              {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
            </Field>

            <Field label="Password">
              <Input id="password" {...register('password')} type="password" placeholder="(leave blank if not change)" />
              {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
            </Field>
          </Fieldset.Content>

          <Button type='submit'>
            Update
          </Button>

          <NavLink to="/registration/logout" end>
            <Button type='submit'>
              Cancle
            </Button>
          </NavLink>

        </Fieldset.Root>
      </form>
    </>
  );
}