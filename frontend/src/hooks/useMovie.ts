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

const useMovie = (dep?: any[]) => useData<Movie>(apiMovie, '/movies', undefined, dep)

export default useMovie