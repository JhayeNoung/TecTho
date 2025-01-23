import { useState, useEffect } from "react";
import { HStack, Image, Button, Spacer, GridItem, Text, Grid, Flex } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import DarkMode from "../components/DarkMode";
import logo from "../assets/logo.webp";

import { useUserStore } from "@/context/useUserStore";

const NavBar = ({ accessToken }: { accessToken: string | null }) => (
  <GridItem area="nav" height="10vh">
    <HStack padding='10px'>
      <NavLink to="/" end>
        <Image src={logo} boxSize="50px" />
      </NavLink>

      <Spacer />

      {accessToken ?
        <NavLink to="/registration/logout">
          <Button variant="plain" _hover={{ textDecoration: "underline" }}>
            {localStorage.getItem("email")}
          </Button>
        </NavLink>
        :
        <NavLink to="/registration">
          <Button variant="plain" _hover={{ textDecoration: "underline" }}>
            User API
          </Button>
        </NavLink>
      }

      <NavLink to="/api" end>
        <Button variant="plain" _hover={{ textDecoration: "underline" }}>
          Movie API
        </Button>
      </NavLink>

      <DarkMode />

    </HStack>
  </GridItem>
);

const Message = ({ message }: { message: string }) => (
  <GridItem
    area="main"
    height="80vh" // 100vh unit refers to 100% of the viewport height, so it takes the full height of the screen
  >
    <Flex
      direction="column"
      justify="center"
      align="center"
      height="100%" // Ensures it takes the full height of the GridItem
    >
      <Text paddingBottom={3}>{message}</Text>
      <NavLink to="/" >
        <Button>Back to Home</Button>
      </NavLink>
    </Flex>
  </GridItem>
);

const Footer = () => (
  <GridItem
    area="footer"
    height="10vh" // 100vh unit refers to 100% of the viewport height, so it takes the full height of the screen
    bg={"gray.100"}
  >
    <Flex
      direction="column"
      justify="center"
      align="center"
      height="100%" // Ensures it takes the full height of the GridItem
    >
      <Text textAlign="center" padding="10px">© 2021 Movie API</Text>
    </Flex>
  </GridItem >
);

export default function Payment() {
  const [message, setMessage] = useState("");
  const { accessToken } = useUserStore();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main" "footer"`,
      }}

      templateColumns={{
        base: '1fr', // base is 1 fraction, means in small device
      }}
    >
      <NavBar accessToken={accessToken} />
      <Message message={message} />
      <Footer />
    </Grid>
  )
};