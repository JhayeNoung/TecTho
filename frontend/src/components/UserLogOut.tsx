import { NavLink } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";
import { Text } from '@chakra-ui/react';
import { useAuth } from '@/context/TokenContext';
import { Button } from '@chakra-ui/react';

function UserLogOut() {
  // const [searchParams] = useSearchParams();
  // const email = searchParams.get("email");
  // const { setToken } = useAuth();

  const logout = () => {
    // setToken(null); // Clear the token from state
    localStorage.removeItem("token"); // clear the token from in-memory
    window.dispatchEvent(new Event("token-change")); // Dispatch a custom event to notify all listeners that the token has changed
  };

  return (
    <>
      <Text>This is Log out page</Text>
      <NavLink to=".." end>
        <Button onClick={logout}>Log Out</Button>
      </NavLink>
    </>
  )
}

export default UserLogOut