import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu"

import useGenre from "@/hooks/useGenre"
import { Button } from "@chakra-ui/react"
import { Genre } from "@/hooks/useGenre"

interface Props {
  onSelectedGenre: (genre: Genre) => void,
  selectedGenre: Genre | null;
}

export default function GenreSelector({ onSelectedGenre, selectedGenre }: Props) {
  const { data: genres, error } = useGenre()

  if (error) return null;

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button>{selectedGenre?.name || 'Genre'}</Button>
      </MenuTrigger>
      <MenuContent>
        {genres.map(genre => <MenuItem key={genre._id} value={genre.name} onClick={() => onSelectedGenre(genre)}>{genre.name}</MenuItem>)}
      </MenuContent>
    </MenuRoot>
  )
}

