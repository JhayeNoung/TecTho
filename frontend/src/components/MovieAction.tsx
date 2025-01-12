
import { Button, HStack } from '@chakra-ui/react'
import apiMovie from '@/services/api-movie'
import { Movie } from '@/hooks/useMovie';

interface Props {
  movie: Movie
}

function MovieAction({ movie }: Props) {
  const handleDelete = async () => {
    try {
      const response = await apiMovie.delete(`/movies/${movie._id}`);
      console.log("Movie deleted successfully:", response.data);
      // Optionally, you can add a callback or refresh the list here
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <HStack>
      <Button variant="plain" _hover={{ color: "blue" }} color="danger" onClick={() => console.log("edit")}>
        Edit
      </Button>
      <Button variant="plain" _hover={{ color: "blue" }} color="danger" onClick={() => console.log("details")}>
        Details
      </Button>
      <Button variant="plain" _hover={{ color: "blue" }} color="danger" onClick={handleDelete}>
        Delete
      </Button>
    </HStack>
  )
}

export default MovieAction