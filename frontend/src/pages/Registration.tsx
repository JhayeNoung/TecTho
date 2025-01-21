import { NavLink, Route, Routes } from "react-router-dom";
import { Button, Grid, GridItem, HStack, Image, Spacer, Box } from "@chakra-ui/react";
import { useState } from "react";

import logo from '../assets/logo.webp'
import DarkMode from "../components/DarkMode";
import UserRegister from "@/components/UserRegister";
import UserList from "@/components/UserList";
import UserLogIn from "@/components/UserLogIn";
import UserLogOut from "@/components/UserLogOut";
import UserUpdate from "@/components/UserUpdate";
import UserVerification from "@/components/UserVerification";
import { useEffect } from "react";

function Registration() {
  const [signal, setSignal] = useState(0);

  // Listen for token-change event and update the signal state to re-render the component
  useEffect(() => {
    window.addEventListener("token-change", () => setSignal(prev => prev + 1)); // Listen for token-change event
    return () => {
      window.removeEventListener("token-change", () => setSignal(prev => prev + 1));
    }
  }, [signal]);

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
        <HStack justifyContent='space-between' padding='10px'>

          <NavLink to="/" end>
            <Image src={logo} boxSize="50px" />
          </NavLink>

          {/* Spacer pushes the rest of the components to the right */}
          <Spacer />

          {localStorage.getItem('email') ?
            <Button variant="plain" fontWeight="bold">
              {localStorage.getItem('email')}
            </Button>
            :
            <Button variant="plain" fontWeight="bold">
              User API
            </Button>
          }

          <NavLink to="/api" end>
            <Button variant="plain" _hover={{ textDecoration: "underline" }}>
              Movie API
            </Button>
          </NavLink>

          <DarkMode />
        </HStack>
      </GridItem>

      {/* registration Forms */}
      <GridItem area="form" padding={{ base: '3', lg: '3 3 3 3' }}>
        <Box padding="3" borderRadius="md" boxShadow="md">
          <Routes>
            <Route index element={<UserLogIn />} />
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