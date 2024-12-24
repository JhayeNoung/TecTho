import MovieForm from "./components/MovieForm"
import MovieList from "./components/MovieList"
import GenreFilter from "./components/GenreFilter"
import { useState } from "react"
import useMovie from "./hooks/useMovie"
import movieService from "./services/movie-service"
import { PostMovie } from "./services/movie-service"
import useGenre from "./hooks/useGenre"
import { Genre } from "./hooks/useGenre"
import { SiDeutschewelle } from "react-icons/si"

export default function Movie() {
    const [refresh, setRefresh] = useState(false); // Trigger for re-fetch
    const {data: movies, error, loading} = useMovie([refresh, setRefresh])
    const {data: genres} = useGenre()
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  
    return (
      <div className="container">
          {/* MovieForm */}
          <div className="mb-3">
            <MovieForm 
              onSubmit={(movie) => 
                movieService
                .post<PostMovie>(movie)
                .then((response)=>{
                  console.log(response.data)
                  setRefresh(!refresh); // Toggle `refresh` to trigger re-fetch
                })
                .catch((err)=>console.log(err.response.data))
              }
            />
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
