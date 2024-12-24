import { Genre } from '@/hooks/useGenre'

/*
First Letter upper:

genre?.name.charAt(0).toUpperCase() + genre?.name.slice(1)
*/

interface Props{
    genre: Genre | null;
}

export default function MovieHeading({genre}: Props) {
  return (
    <div>{!genre?.name ? "All Movie" : genre?.name.charAt(0).toUpperCase() + genre?.name.slice(1) + " Movie"}</div>  
)
}
