import { Button, HStack } from '@chakra-ui/react'
import apiMovie from '@/services/api-movie'
import { User } from '@/hooks/useUser'
import { NavLink } from 'react-router-dom'

interface Props {
  user: User
}

function UserAction({ user }: Props) {
  const storedToken = localStorage.getItem('token');

  const handleLoginFirst = () => {
    window.alert("You need to login first");
  }

  const handleDelete = async () => {
    apiMovie
      .delete(`/users/${user._id}`, {
        headers: {
          Authorization: `${storedToken}`,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        window.dispatchEvent(new Event("user-delete")); // Dispatch event on successful delete
      })
      .catch(error => {
        switch (error.status) {
          case 404:
            window.alert(error.message);
            break;
          case 401:
          case 400:
          case 403:
            window.alert(error.response.data);
            break;
          case 500:
            window.alert(error.message);
            break;
          default:
            window.alert("An unexpected error occurred");
        }
      })
  };

  return (
    <>
      {/* if token present, use TableCell UserAction, else use TableCell of Edit and Delete buttons which are dimm */}
      {storedToken ?
        <HStack>
          <NavLink to="/registration/logout" state={{ user }}><Button variant="plain" _hover={{ color: "cyan" }} color="blue">Edit</Button></NavLink>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={handleDelete}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" color="gray" onClick={() => handleLoginFirst()}>
            Edit
          </Button>
          <Button variant="plain" color="gray" onClick={() => handleLoginFirst()}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

export default UserAction