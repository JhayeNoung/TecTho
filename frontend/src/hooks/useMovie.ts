import useData from "./useData";
import apiMovie from "@/services/api-movie";
import { Genre } from "./useGenre";
  
export interface Movie {
    "_id": string,
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": Genre,
    "poster": string,
}

export interface PostMovie {
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": string,
    "poster": string,
}

export interface MovieQuery{
    page: number,
}

const useMovie = (movieQuery?: MovieQuery) => useData<Movie>(apiMovie, '/movies', {params:{page: movieQuery?.page}}, [movieQuery])

export default useMovie