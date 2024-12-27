import MovieForm from "./components/MovieForm"
import MovieList from "./components/MovieList"
import GenreFilter from "./components/GenreFilter"
import { useState } from "react"
import { Movie } from "./hooks/useMovie"
import { CanceledError } from "axios"
import apiMovie from "./services/api-movie"
import { useEffect } from "react"
import useGenre, { Genre } from "./hooks/useGenre"

interface FetchResponse{
  count: number,
  results: Movie[],
}

type Error = {
  message: string
}

export default function MovieAPI() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const {data: genres} = useGenre()
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error>({message: ""})
    const [refreshKey, setRefreshKey] = useState(0); // State for manual re-render


    useEffect(()=>{
        setLoading(true)
        const controller = new AbortController();
        apiMovie
        .get<FetchResponse>('/movies', {signal: controller.signal})
        .then(response=>{
            setMovies(response.data.results)
            setLoading(false)
        })
        .catch(error=>{
            if(error instanceof CanceledError) return;
            console.log(error)
            setError(error)
            setLoading(false)
        })
        return ()=>controller.abort()
    },[refreshKey])

  
    return (
      <div className="container">
          {/* MovieForm */}
          <div className="mb-3">
            <MovieForm />
          </div>
  
          {/* GenreFilter */}
          <div className="mb-3">
            <GenreFilter
                onChange={(e) => {
                  genres.map(genre=>{
                    if (e.target.value === ""){
                      setSelectedGenre(null)
                    } else if (`${genre._id}` === e.target.value){
                      setSelectedGenre(genre)
                    }
                  })
                }
            }/>
          </div>
  
          {/* MovieList */}
          <div className="mb-3">
            {loading && <p className="spinner-border"></p>}
            <MovieList
              movies={movies}
              selectedGenre={selectedGenre}
            />
          </div>
  
          <div>
            {error && <p>{error.message}</p>}
          </div>
      </div>
    )
  
}
