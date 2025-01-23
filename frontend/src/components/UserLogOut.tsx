import { NavLink } from 'react-router-dom'
import { Button, Box, Text } from "@chakra-ui/react";
import { useAuth } from '@/context/AuthContext';

function UserLogOut() {
  const { updateToken, updateEmail } = useAuth();

  const logout = () => {
    updateEmail("");
    updateToken("");
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