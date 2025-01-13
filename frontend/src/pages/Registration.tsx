import { NavLink, Route, Routes } from "react-router-dom";
import { Button, Grid, GridItem, HStack, Image, Spacer } from "@chakra-ui/react";

import logo from '../assets/logo.webp'
import DarkMode from "../components/DarkMode";
import UserRegister from "@/components/UserRegister";
import UserList from "@/components/UserList";
import UserLogIn from "@/components/UserLogIn";
import UserUpdate from "@/components/UserUpdate";
import { useUser } from "@/hooks/useUser";
import UserLogOut from "@/components/UserLogOut";
import AlertMessage from "@/components/AlertMessage";

function Registration() {
  const { users, error } = useUser();

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "form list"`
      }}

      templateColumns={{
        base: '1fr', // base is 1 fraction, means in small device
        lg: '400px 1fr', // in large scree, first column take 200px and second takes all
      }}
    >

      {/* Navigation Bar */}
      <GridItem area="nav" bg="coral">
        <HStack justifyContent='space-between' padding='10px'>

          <NavLink to="/" end>
            <Image src={logo} boxSize="60px" />
          </NavLink>

          {/* Spacer pushes the rest of the components to the right */}
          <Spacer />

          <NavLink to="/registration">
            <Button variant="plain" _hover={{ textDecoration: "underline" }}>
              Sign In
            </Button>
          </NavLink>

          <NavLink to="/api" end>
            <Button variant="plain" _hover={{ textDecoration: "underline" }}>
              API
            </Button>
          </NavLink>

          <DarkMode />
        </HStack>
      </GridItem>

      {/* registration Forms */}
      <GridItem area="form" bg="dodgerblue">
        <Routes>
          <Route index element={<UserLogIn />} />
          <Route path="logout" element={<UserLogOut />} />
          <Route path="register" element={<UserRegister />} />
          <Route path='update' element={<UserUpdate />} />
        </Routes>
      </GridItem>

      {/* User List */}
      <GridItem area="list" bg="yellow">
        {error && <AlertMessage message={error} />}
        <UserList users={users} />
      </GridItem>

    </Grid>
  );
}

export default Registration;