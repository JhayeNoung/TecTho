import { NavLink } from 'react-router-dom'
import { Button, Box, Text } from "@chakra-ui/react";
import { useState } from 'react';

import { useUserStore } from '@/context/useUserStore';
import apiMovie from '@/services/api-movie';
import { logUserError } from '@/services/log-error';
import AlertMessage from './AlertMessage';

function UserLogOut() {
  const { logout } = useUserStore();
  const [alert, setAlert] = useState("");

  const handleLogout = async () => {
    try {
      await apiMovie.post('/users/logout', null, { withCredentials: true }); // clear refresh tokken in cookies
      logout(); // clear the token and email from the state (or in-memory)
    }
    catch (error: any) {
      logUserError(error, setAlert);
    }
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <Text>{localStorage.getItem("email")}</Text>

      <Box paddingTop={3}>
        <NavLink to=".." end>
          <Button onClick={handleLogout}>Log Out</Button>
        </NavLink>
      </Box>
    </>
  )
}

export default UserLogOut