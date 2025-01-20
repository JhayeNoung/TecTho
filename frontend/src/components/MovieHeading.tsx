import { MovieQuery } from '@/hooks/useMovie'
import { Heading } from '@chakra-ui/react';
/*
First Letter upper:

genre?.name.charAt(0).toUpperCase() + genre?.name.slice(1)
*/

interface Props {
  query: MovieQuery
}

export default function MovieHeading({ query }: Props) {
  const heading = !query.genre?.name ? "All Movie" : query.genre?.name.charAt(0).toUpperCase() + query.genre?.name.slice(1) + " Movie";
  return (
    <Heading size="3xl">{heading}</Heading>
  )
}
