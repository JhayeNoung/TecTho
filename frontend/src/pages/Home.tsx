import { Grid, GridItem, Show, useBreakpointValue } from "@chakra-ui/react"
import { useState } from "react"

import { MovieQuery } from "../hooks/useMovie"
import GenreList from "../components/GenreList"
import PageBar from "../components/PageBar"
import MovieHeading from "../components/MovieHeading"
import MovieGrib from "../components/MovieGrib"
import SortSelector from "../components/SortSelector"
import NavBar from "../components/NavBar"


function Home() {
    const breakpoint = useBreakpointValue({ base: 0, lg: 1 })
    const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery)

    return (
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
                <NavBar onSearch={(search) => setMovieQuery({ ...movieQuery, search })} />
            </GridItem>

            {/* Conditionally render based on screen size using `when` */}
            {/* Show Aside on 'lg' */}
            <Show when={breakpoint === 1}>
                <GridItem area="aside" bg="gold">
                    <GenreList selectedGenre={movieQuery.genre} onClick={genre => { setMovieQuery({ ...movieQuery, genre }) }} />
                </GridItem>
            </Show>

            <GridItem area="main" bg="dodgerblue">
                <MovieHeading query={movieQuery} />
                <SortSelector selectedSortOrder={movieQuery.ordering} onSelectedSortOrder={(ordering) => setMovieQuery({ ...movieQuery, ordering })} />
                <MovieGrib movieQuery={movieQuery} />
            </GridItem>

            <GridItem area="page" bg="red">
                <p>Footer</p>
                {/* <PageBar onPageSelect={(page) => setMovieQuery({ page })} /> */}
            </GridItem>

        </Grid>
    )
}

export default Home