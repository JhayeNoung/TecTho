import { Genre } from '@/hooks/useGenre'
import { MovieQuery } from '@/hooks/useMovie'

/*
First Letter upper:

genre?.name.charAt(0).toUpperCase() + genre?.name.slice(1)
*/

interface Props {
  query: MovieQuery
}

export default function MovieHeading({ query }: Props) {
  return (
    <div>{!query.genre?.name ? "All Movie" : query.genre?.name.charAt(0).toUpperCase() + query.genre?.name.slice(1) + " Movie"}</div>
  )
}
