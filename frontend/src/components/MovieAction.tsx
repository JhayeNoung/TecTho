
import { Button, HStack } from '@chakra-ui/react'
import apiMovie from '@/services/api-movie'
import { Movie } from '@/hooks/useMovie';

interface Props {
  movie: Movie
}

function MovieAction({ movie }: Props) {
  const storedToken = localStorage.getItem('token');

  const handleDelete = async () => {
    apiMovie
      .delete(`/movies/${movie._id}`, {
        headers: {
          Authorization: `${storedToken}`,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        window.dispatchEvent(new Event("user-delete")); // Dispatch event on successful delete
      })
      .catch(error => {
        console.log(error)
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
      {storedToken ?
        <HStack>
          <Button variant="plain" _hover={{ color: "cyan" }} color="blue" onClick={() => console.log("edit")}>
            Edit
          </Button>
          <Button variant="plain" _hover={{ color: "cyan" }} color="blue" onClick={() => console.log("details")}>
            Details
          </Button>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={handleDelete}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" color="grey">
            Edit
          </Button>
          <Button variant="plain" color="grey">
            Details
          </Button>
          <Button variant="plain" color="grey">
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

export default MovieAction