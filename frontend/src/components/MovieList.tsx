import { Table, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from "@chakra-ui/react"

import { Movie } from "@/hooks/useMovie";
import { Genre } from "@/hooks/useGenre";
import MovieAction from "./MovieAction";

interface Props {
    movies: Movie[];
    selectedGenre: Genre | null;
}

export default function MovieList({ movies, selectedGenre }: Props) {

    return (
        <TableRoot interactive>
            <TableHeader>
                <TableRow>
                    <TableColumnHeader>Title</TableColumnHeader>
                    <TableColumnHeader>Stock</TableColumnHeader>
                    <TableColumnHeader>Rental Rate</TableColumnHeader>
                    <TableColumnHeader>Genre</TableColumnHeader>
                </TableRow>
            </TableHeader>

            <TableBody>
                {movies
                    .filter(movie => selectedGenre === null || movie.genre._id === selectedGenre._id)
                    .map(movie =>
                        <TableRow key={movie._id}>
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>{movie.numberInStock}</TableCell>
                            <TableCell>{movie.dailyRentalRate}</TableCell>
                            <TableCell>{movie.genre.name}</TableCell>
                            <TableCell><MovieAction movie={movie} /></TableCell>
                        </TableRow>
                    )}
            </TableBody>
        </TableRoot>
    )
}
