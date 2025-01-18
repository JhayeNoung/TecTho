import { useState, useEffect } from "react";
import { HStack, Image, Button, Spacer, GridItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import DarkMode from "../components/DarkMode";
import logo from "../assets/logo.webp";

const NavBar = ({ storedToken }: { storedToken: string | null }) => (
  <GridItem area="nav" bg="coral">

    <HStack padding='10px'>

      <NavLink to="/" end>
        <Image src={logo} boxSize="60px" />
      </NavLink>

      <Spacer />

      {storedToken ?
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

      <NavLink to="/payment" end>
        <Button variant="plain" _hover={{ textDecoration: "underline" }}>
          Payment
        </Button>
      </NavLink>

      <DarkMode />
    </HStack >
  </GridItem>
);

const ProductDisplay = () => (
  <section>
    <div className="product">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
      />
      <div className="description">
        <h3>Stubborn Attachments</h3>
        <h5>$20.00</h5>
      </div>
    </div>
    <form action="http://localhost:3001/api/stripe/create-checkout-session" method="POST">
      <button type="submit">
        Checkout
      </button>
    </form>
  </section>
);


const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
    <NavLink to="/">
      <Button>Back to Home</Button>
    </NavLink>
  </section>
);


export default function Payment() {
  const [message, setMessage] = useState("");
  const storedToken = localStorage.getItem('token');

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

  return message ? (
    <Message message={message} />
  ) : (
    <>
      <NavBar storedToken={storedToken} />
      <ProductDisplay />
    </>
  );
}