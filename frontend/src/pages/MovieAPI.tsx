import { HStack, Image, Grid, GridItem, Spacer, Button, Box } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import logo from '../assets/logo.webp'
import MovieList from '@/components/MovieList';
import MovieForm from '@/components/MovieForm';
import DarkMode from '../components/DarkMode';
import { MovieQuery } from '@/hooks/useMovie';
import GenreSelector from '@/components/GenreSelector';
import SortSelector from '@/components/SortSelector';
import { useUserStore } from '@/context/useUserStore';

function MovieAPI() {
  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery)
  const { accessToken } = useUserStore();

  return (
    <Grid
      templateAreas={{
        base: `"nav" "form" "list"`,  // Stack nav, form, and list in one column for small screens
        lg: `"nav nav" "form list"`,  // In large screens, side by side
        md: `"nav" "form" "list"`,
        sm: `"nav" "form" "list"`,
      }}

      templateColumns={{
        base: '1fr', // 1 fraction for all elements in small screens (stacked)
        lg: '350px 1fr', // On large screens, side by side
        md: '1fr',
        sm: '1fr',
      }}
    >


      {/* Navigation Bar */}
      <GridItem area="nav">
        <HStack padding='10px'>

          <NavLink to="/" end>
            <Image src={logo} boxSize="50px" />
          </NavLink>

          {/* Spacer pushes the rest of the components to the right */}
          <Spacer />

          {accessToken ?
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
      <GridItem area="form" padding={{ base: '3', lg: '3 3 3 3' }}>
        <Box padding="3" borderRadius="md" boxShadow="md">
          <MovieForm />
        </Box>
      </GridItem>


      {/* Movie List */}
      <GridItem area="list" padding={{ base: '3', lg: '3 3 3 3' }}>

        <Box paddingBottom={3}>
          <HStack>
            <GenreSelector onSelectedGenre={(genre) => setMovieQuery({ ...movieQuery, genre })} />
            <SortSelector selectedSortOrder={movieQuery.ordering} onSelectedSortOrder={(ordering) => setMovieQuery({ ...movieQuery, ordering })} />
          </HStack>
        </Box>

        <Box>
          <MovieList movieQuery={movieQuery} />
        </Box>
      </GridItem>

    </Grid>

  )
}

export default MovieAPI