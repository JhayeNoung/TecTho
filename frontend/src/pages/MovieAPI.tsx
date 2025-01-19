import { HStack, Image, Grid, GridItem, Spacer, Button } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import logo from '../assets/logo.webp'
import MovieList from '@/components/MovieList';
import MovieForm from '@/components/MovieForm';
import DarkMode from '../components/DarkMode';
import { MovieQuery } from '@/hooks/useMovie';
import GenreSelector from '@/components/GenreSelector';
import SortSelector from '@/components/SortSelector';
import SearchInput from '@/components/SearchInput';

function MovieAPI() {
  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery)
  const storedToken = localStorage.getItem('token');

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "form list"`
      }}

      templateColumns={{
        base: '1fr', // base is 1 fraction, means in small device
        lg: '350px 1fr', // in large scree, first column take 200px and second takes all
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

          {storedToken ?
            <NavLink to="/registration/logout">
              <Button variant="plain" _hover={{ textDecoration: "underline" }}>
                {localStorage.getItem("email")}
              </Button>
            </NavLink>
            :
            <NavLink to="/registration">
              <Button variant="plain" _hover={{ textDecoration: "underline" }}>
                User API
              </Button>
            </NavLink>
          }

          <Button variant="plain" fontWeight="bold">
            Movie API
          </Button>

          <DarkMode />
        </HStack>
      </GridItem>


      {/* Movie Form */}
      <GridItem area="form" paddingLeft={3} paddingTop={3}>
        <MovieForm />
      </GridItem>


      {/* Movie List */}
      <GridItem area="list" padding={{ base: '3', lg: '3 3 3 3' }}>
        <SearchInput submitHandler={(event) => setMovieQuery({ ...movieQuery, search: event.searchName })} />

        <HStack>
          <GenreSelector onSelectedGenre={(genre) => setMovieQuery({ ...movieQuery, genre })} />
          <SortSelector selectedSortOrder={movieQuery.ordering} onSelectedSortOrder={(ordering) => setMovieQuery({ ...movieQuery, ordering })} />
        </HStack>

        <MovieList movieQuery={movieQuery} />
      </GridItem>

    </Grid>

  )
}

export default MovieAPI