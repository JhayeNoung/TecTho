import useData from "./useData"
import apiMovie from "@/services/api-movie"

export type Genre = {
    "_id": number,
    "name": string,
}

const useGenre = () => useData<Genre>(apiMovie, "/genres")

export default useGenre