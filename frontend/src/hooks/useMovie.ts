import useData from "./useData";
import apiMovie from "@/services/api-movie";
import { Genre } from "./useGenre";

export interface Movie {
    "_id": string,
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": Genre,
    "poster_url": string,
}

export interface MovieQuery {
    page: number,
    genre: Genre,
    search: string,
    ordering: string,
}

const useMovie = (movieQuery?: MovieQuery) => useData<Movie>(
    apiMovie,
    '/movies',
    { params: { page: movieQuery?.page, genre: movieQuery?.genre?._id, search: movieQuery?.search, ordering: movieQuery?.ordering } },
    [movieQuery]
)
export default useMovie