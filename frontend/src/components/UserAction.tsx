import { Button, HStack } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

import { User } from '@/hooks/useUser'
import { useUserStore } from '@/context/useUserStore'
import { logActionError } from '@/services/log-error'
import apiMovie from '@/services/api-movie'

interface Props {
  user: User
}

function UserAction({ user }: Props) {
  const { accessToken, updateActions } = useUserStore();

  const handleDelete = async () => {
    try {
      await apiMovie.delete(`/users/${user._id}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      window.alert("User deleted successfully");
      updateActions(['user-delete']);
    }
    catch (error: any) {
      logActionError(error);
    }
  };

  return (
    <>
      {/* if token present, use TableCell UserAction, else use TableCell of Edit and Delete buttons which are dimm */}
      {accessToken ?
        <HStack>
          <NavLink to="/registration/logout/update" state={{ user }}><Button variant="plain" _hover={{ color: "cyan" }} color="blue">Edit</Button></NavLink>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={handleDelete}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" color="gray" _hover={{ textDecoration: "underline" }} onClick={() => window.alert("You need to login first")}>
            Edit
          </Button>
          <Button variant="plain" color="gray" _hover={{ textDecoration: "underline" }} onClick={() => window.alert("You need to login first")}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

export default UserAction