import { HStack, Image, Grid, GridItem, Spacer, Button } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CanceledError } from '@/services/api-movie';


import logo from '../assets/logo.webp'
import MovieList from '@/components/MovieList';
import GenreFilter from '@/components/GenreFilter';
import MovieForm from '@/components/MovieForm';
import apiMovie from '@/services/api-movie';
import useGenre, { Genre } from '@/hooks/useGenre';
import { Movie } from '@/hooks/useMovie';
import DarkMode from '../components/DarkMode';

interface FetchResponse {
  count: number,
  results: Movie[],
}

type Error = {
  message: string
}

function MovieAPI() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { data: genres } = useGenre()
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>({ message: "" })
  const [refreshKey, setRefreshKey] = useState(0); // State for manual re-render

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController();
    apiMovie
      .get<FetchResponse>('/movies', { signal: controller.signal })
      .then(response => {
        setMovies(response.data.results)
        setLoading(false)
      })
      .catch(error => {
        if (error instanceof CanceledError) return;
        console.log(error)
        setError(error)
        setLoading(false)
      })
    return () => controller.abort()
  }, [refreshKey])

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "form list"`
      }}

      templateColumns={{
        base: '1fr', // base is 1 fraction, means in small device
        lg: '400px 1fr', // in large scree, first column take 200px and second takes all
      }}
    >


      {/* Navigation Bar */}
      <GridItem area="nav" bg="coral">
        <HStack padding='10px'>

          <NavLink to="/" end>
            <Image src={logo} boxSize="60px" />
          </NavLink>

          {/* Spacer pushes the rest of the components to the right */}
          <Spacer />

          <NavLink to="/registration">
            <Button variant="plain" _hover={{ textDecoration: "underline" }}>
              User API
            </Button>
          </NavLink>

          <Button variant="plain" fontWeight="bold">
            Movie API
          </Button>

          <DarkMode />
        </HStack>
      </GridItem>


      {/* Movie Form */}
      <GridItem area="form" bg="dodgerblue">
        <MovieForm />
      </GridItem>


      {/* Movie List */}
      <GridItem area="list" bg="yellow">
        <GenreFilter
          onChange={(e) => {
            genres.map(genre => {
              if (e.target.value === "") {
                setSelectedGenre(null)
              } else if (`${genre._id}` === e.target.value) {
                setSelectedGenre(genre)
              }
            })
          }
          } />
        {loading && <p className="spinner-border"></p>}
        <MovieList
          movies={movies}
          selectedGenre={selectedGenre}
        />
        {error && <p>{error.message}</p>}
      </GridItem>

    </Grid>
  )
}

export default MovieAPI