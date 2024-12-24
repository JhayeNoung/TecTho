import { Grid, GridItem, Show, useBreakpointValue } from "@chakra-ui/react"
import { useState } from "react"
import NavBar from "./components/NavBar"
import MovieList from "./components/MovieList"
import useMovie from "./hooks/useMovie"
import GenreList from "./components/GenreList"
import { Genre } from "./hooks/useGenre"
import MovieHeading from "./components/MovieHeading"
import PageBar from "./components/PageBar"
import { MovieQuery } from "./hooks/useMovie"

function App() {
  const breakpoint = useBreakpointValue({base: 0, lg: 1})
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [ movieQuery, setMovieQuery ] = useState<MovieQuery>({} as MovieQuery)
  const {data, error, loading} = useMovie(movieQuery)

  return (
    <>

      <Grid
        templateAreas={{
          base: `"nav" "main" "page"`,
          lg: `"nav nav" "aside main" "page page"`
        }}

        templateColumns={{
          base: '1fr', // base is 1 fraction, means in small device
          lg: '200px 1fr', // in large scree, first column take 200px and second takes all
        }}
      >
        <GridItem area="nav" bg="coral">
          <NavBar onSearch={(searchValue)=>console.log(searchValue)}/>
        </GridItem>

        {/* Conditionally render based on screen size using `when` */}
        {/* Show Aside on 'lg' */}
        <Show when={breakpoint === 1}>
          <GridItem area="aside" bg="gold">
            <GenreList onClick={select=>{
              setSelectedGenre(select)
              console.log(selectedGenre)
            }}/>
          </GridItem>
        </Show>
        
        <GridItem area="main" bg="dodgerblue">
          <MovieHeading genre={selectedGenre}/>
          <MovieList movies={data} selectedGenre={selectedGenre}/>
        </GridItem>

        <GridItem area="page" bg="red">
          <PageBar onPageSelect={(page)=>setMovieQuery({page})}/>
        </GridItem>

      </Grid>
    </>
  )
}

export default App
