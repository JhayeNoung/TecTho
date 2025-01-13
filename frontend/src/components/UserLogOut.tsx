import { NavLink } from 'react-router-dom'
import { Text } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

interface Props {
  email: string;
}

function UserLogOut({ email }: Props) {

  const logout = () => {
    localStorage.removeItem("token"); // clear the token from in-memory
    window.dispatchEvent(new Event("token-change")); // Dispatch a custom event to notify all listeners that the token has changed
  };

  return (
    <>
      <Text>{email}</Text>
      <NavLink to=".." end>
        <Button onClick={logout}>Log Out</Button>
      </NavLink>
    </>
  )
}

export default UserLogOut