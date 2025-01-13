
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from "@chakra-ui/react";
import { Text } from '@chakra-ui/react';
import UserUpdate from './UserUpdate';


function UserLogOut() {
  const location = useLocation(); // get "state" from NavLink Edit component of UserAction
  const user = location.state?.user; // get user data from "state"

  const logout = () => {
    localStorage.removeItem("token"); // clear the token from in-memory
    localStorage.removeItem("email"); // clear the email from in-memory
    window.dispatchEvent(new Event("token-change")); // Dispatch a custom event to notify all listeners that the token has changed
  };

  return (
    <>
      <Text>{localStorage.getItem("email")}</Text>

      {user ?
        <UserUpdate user={user} />
        :
        <NavLink to=".." end>
          <Button onClick={logout}>Log Out</Button>
        </NavLink>
      }
    </>
  )
}

export default UserLogOut