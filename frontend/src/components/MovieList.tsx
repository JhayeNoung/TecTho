import { Text, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow, Spinner } from "@chakra-ui/react"

import MovieAction from "./MovieAction";
import useMovie from "@/hooks/useMovie";
import { MovieQuery } from "@/hooks/useMovie";

// interface Props {
//     movies: Movie[];
//     selectedGenre: Genre | null;
// }

interface Props {
    movieQuery: MovieQuery
}


export default function MovieList({ movieQuery }: Props) {
    const { error, data: movies, loading } = useMovie(movieQuery)

    if (error) return <Text>{error}</Text>

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
                {loading &&
                    <TableRow>
                        <TableCell><Spinner /></TableCell>
                    </TableRow>}

                {movies
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
