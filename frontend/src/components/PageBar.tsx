import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Movie } from '@/hooks/useMovie';
import apiMovie from '@/services/api-movie';

interface Props{
    onPageSelect: (selectPage: number) => void;
}

type FetchMovieResponse = {
  count: number,
  page_size: number,
  results: Movie[],
}

export default function PageBar({onPageSelect}: Props) {
  const [pageNumber, setPageNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController();
    apiMovie
      .get<FetchMovieResponse>("/movies", {signal: controller.signal})
      .then((response) => setPageNumber(response.data.page_size))
      .catch((error) => {
        if (error.name === 'CanceledError') return
        console.error(error);
      });
    return ()=>controller.abort()
  }, []);

  return (
    <>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(1)}>1</Button>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(2)}>2</Button>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(3)}>3</Button>
    </>

  )
}
