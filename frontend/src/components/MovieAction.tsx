
import { Button, HStack } from '@chakra-ui/react'
import apiMovie from '@/services/api-movie'
import { Movie } from '@/hooks/useMovie';
import Dialog from './Dialog';
import MovieUpdate from './MovieUpdate';

import { useUserStore } from '@/context/useUserStore';

interface Props {
  movie: Movie
}

function MovieAction({ movie }: Props) {
  const { accessToken } = useUserStore();

  const handleDelete = async () => {
    try {
      const poster_key = movie.poster_url.split('com/')[1]
      const presigned_poster = await apiMovie.post('/presigned-url/delete-url', { KEY: poster_key });

      const video_key = movie.video_url.split('com/')[1]
      const presigned_video = await apiMovie.post('/presigned-url/delete-url', { KEY: video_key });

      await apiMovie.delete(`/movies/${movie._id}`, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      // Delete the file from S3 using the pre-signed URL after the movie is successfully deleted
      await fetch(presigned_poster.data.url, {
        method: 'DELETE',
      });

      // Delete the file from S3 using the pre-signed URL after the movie is successfully deleted
      await fetch(presigned_video.data.url, {
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
      {accessToken ?
        <HStack>
          <MovieUpdate movie={movie}>Edit</MovieUpdate>
          <Dialog data={movie}>Detail</Dialog>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={handleDelete}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Edit
          </Button>
          <Dialog data={movie}>Detail</Dialog>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

export default MovieAction