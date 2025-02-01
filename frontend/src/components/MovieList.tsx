import { TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow, Spinner } from "@chakra-ui/react"
import { CanceledError } from "@/services/api-movie";
import { Table } from "@chakra-ui/react"

import MovieAction from "./MovieAction";
import { MovieQuery, Movie } from "@/hooks/useMovie";
import { FetchResponse } from "@/hooks/useData";
import { useEffect, useState } from "react";
import apiMovie from "@/services/api-movie";
import { useMovieStore } from "@/context/useMovieStore";

interface Props {
    movieQuery: MovieQuery
}

export default function MovieList({ movieQuery }: Props) {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true);
    const { actions } = useMovieStore();

    useEffect(() => {
        setLoading(true);

        const controller = new AbortController();

        apiMovie
            .get<FetchResponse<Movie>>("/movies", { signal: controller.signal, params: { search: movieQuery?.search, genre: movieQuery?.genre?._id, ordering: movieQuery?.ordering } })
            .then(response => {
                setMovies(response.data.results)
                setLoading(false);
            })
            .catch(error => {
                if (error instanceof CanceledError) return;
                window.alert("An unexpected error occurred");
                setLoading(false);
            })

        return () => {
            controller.abort();
        };
    }, [actions, movieQuery]);

    return (
        <>
            <Table.ScrollArea borderWidth="1px" rounded="md" height="560px">
                <TableRoot stickyHeader>
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

                        {movies.map(movie =>
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
            </Table.ScrollArea>
        </>
    )
}
