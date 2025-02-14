import { useForm } from "react-hook-form";
import { NavLink, useLocation, Route, Routes } from "react-router-dom";
import { Text, Input, Fieldset, Stack, Button, Grid, GridItem, HStack, Image, Spacer, Box, Table, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { zodResolver } from '@hookform/resolvers/zod';

import { useUser, User, useUserActions, LoginUser, schemaLoginUser, CreateUser, schemaCreateUser, Key, schemaKey } from "@/hooks/useUser";
import { useUserStore } from "@/context/useUserStore";
import logo from '../assets/logo.webp'
import DarkMode from "../components/DarkMode";
import AlertMessage from "@/components/AlertMessage";


const UserVerification = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Key>({ resolver: zodResolver(schemaKey) });
  const { alert, loading, handleVerify } = useUserActions();

  const onSubmit = async (payload: Key) => {
    handleVerify(payload);
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

const UserRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUser>({ resolver: zodResolver(schemaCreateUser) });
  const { alert, loading, handleCreate } = useUserActions();

  const onSubmit = async (payload: CreateUser) => {
    handleCreate(payload);
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

const UserLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginUser>({ resolver: zodResolver(schemaLoginUser) });
  const { alert, handleLogin } = useUserActions();

  const onSubmit = async (payload: LoginUser) => {
    handleLogin(payload);
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

const UserLogOut = () => {
  const { alert, handleLogout } = useUserActions();

  const onClick = async () => {
    handleLogout();
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <Text>{localStorage.getItem("email")}</Text>

      <Box paddingTop={3}>
        <NavLink to=".." end>
          <Button onClick={onClick}>Log Out</Button>
        </NavLink>
      </Box>
    </>
  )
}

const UserUpdate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<User>();
  const { alert, handleUpdate } = useUserActions();
  const location = useLocation();
  const user = location.state?.user;

  const onSubmit = async (payload: User) => {
    handleUpdate(user, payload);
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

const UserAction = ({ user }: { user: User }) => {
  const { accessToken } = useUserStore();
  const { handleDelete } = useUserActions();

  const onClick = async () => {
    handleDelete(user);
  };

  return (
    <>
      {/* if token present, use TableCell UserAction, else use TableCell of Edit and Delete buttons which are dimm */}
      {accessToken ?
        <HStack>
          <NavLink to="/registration/logout/update" state={{ user }}>
            <Button variant="plain" _hover={{ color: "cyan" }} color="blue">Edit</Button>
          </NavLink>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={onClick}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" color="gray" _hover={{ textDecoration: "underline" }} onClick={() => window.alert("You need to login first")}>
            Edit
          </Button>
          <Button variant="plain" color="gray" _hover={{ textDecoration: "underline" }} onClick={() => window.alert("You need to login first")}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

const UserList = () => {
  const { users, error } = useUser();

  return (
    <>
      {error && <AlertMessage message={error} />}

      <Table.ScrollArea borderWidth="1px" rounded="md" height="560px">
        <TableRoot stickyHeader>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>Name</TableColumnHeader>
              <TableColumnHeader>Email</TableColumnHeader>
              <TableColumnHeader>Role</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin == true ? "Admin" : "Staff"}</TableCell>
                <TableCell textAlign="end"><UserAction user={user} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </Table.ScrollArea>
    </>
  )
}

const NavBar = () => {
  const { accessToken } = useUserStore();

  return (
    <HStack justifyContent='space-between' padding='10px'>

      <NavLink to="/" end>
        <Image src={logo} boxSize="50px" />
      </NavLink>

      {/* Spacer pushes the rest of the components to the right */}
      <Spacer />

      {accessToken ?
        <Button variant="plain" fontWeight="bold">
          {localStorage.getItem('email')}
        </Button>
        :
        <Button variant="plain" fontWeight="bold">
          User Panel
        </Button>
      }

      <NavLink to="/movie-panel" end>
        <Button variant="plain" _hover={{ textDecoration: "underline" }}>
          Movie Panel
        </Button>
      </NavLink>

      <DarkMode />
    </HStack>
  );
}

function Registration() {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "form" "list"`,  // Stack nav, form, and list in one column for small screens
        lg: `"nav nav" "form list"`,  // In large screens, side by side
        md: `"nav" "form" "list"`,
        sm: `"nav" "form" "list"`,
      }}

      templateColumns={{
        base: '1fr', // 1 fraction for all elements in small screens (stacked)
        lg: '350px 1fr', // On large screens, side by side
        md: '1fr',
        sm: '1fr',
      }}
    >

      {/* Navigation Bar */}
      <GridItem area="nav">
        <NavBar />
      </GridItem>

      {/* registration Forms */}
      <GridItem area="form" padding={{ base: '3', lg: '3 3 3 3' }}>
        <Box padding="3" borderRadius="md" boxShadow="md">
          <Routes>
            <Route index element={<UserLogin />} />
            <Route path="logout" element={<UserLogOut />} />
            <Route path="logout/update" element={<UserUpdate />} />
            <Route path="register" element={<UserRegister />} />
            <Route path="register/verification" element={<UserVerification />} />
          </Routes>
        </Box>
      </GridItem>

      {/* User List */}
      <GridItem area="list" padding={{ base: '3', lg: '3 3 3 3' }}>
        <UserList />
      </GridItem>

    </Grid>
  );
}

export default Registration;