import { NavLink } from 'react-router-dom'
import { Button, Box, Text } from "@chakra-ui/react";

function UserLogOut() {
  const logout = () => {
    localStorage.removeItem("token"); // clear the token from in-memory
    localStorage.removeItem("email"); // clear the email from in-memory
    window.dispatchEvent(new Event("token-change")); // Dispatch a custom event to notify all listeners that the token has changed
  };

  return (
    <>

      <Text>{localStorage.getItem("email")}</Text>

      <Box paddingTop={3}>
        <NavLink to=".." end>
          <Button onClick={logout}>Log Out</Button>
        </NavLink>
      </Box>
    </>
  )
}

export default UserLogOut