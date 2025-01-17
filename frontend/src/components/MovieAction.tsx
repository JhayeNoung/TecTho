
import { Button, HStack } from '@chakra-ui/react'
import apiMovie from '@/services/api-movie'
import { Movie } from '@/hooks/useMovie';

interface Props {
  movie: Movie
}

function MovieAction({ movie }: Props) {
  const storedToken = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      const key = movie.poster_url.split('com/')[1]

      // Get the pre-signed URL from the backend
      const presigned_response = await apiMovie.post('/presigned-url/delete-url', { KEY: key });

      await apiMovie
        .delete(`/movies/${movie._id}`, {
          headers: {
            Authorization: `${storedToken}`,
            "Content-Type": "multipart/form-data"
          }
        })

      // Delete the file from S3 using the pre-signed URL after the movie is successfully deleted
      await fetch(presigned_response.data.url, {
        method: 'DELETE',
      });

      window.dispatchEvent(new Event("movie-delete")); // Dispatch event on successful delete
    }
    catch (error: any) {
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
    }
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
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Edit
          </Button>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Details
          </Button>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

export default MovieAction