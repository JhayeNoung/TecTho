import { SimpleGrid, Text } from '@chakra-ui/react';
import useMovie, { MovieQuery } from '@/hooks/useMovie';
import MovieCard from './MovieCard';
import MovieCardContainer from './MovieCardContainer';
import MovieCardSkeleton from './MovieCardSkeleton';

interface Props {
    movieQuery: MovieQuery
}

function MovieGrib({ movieQuery }: Props) {
    const { error, data, loading } = useMovie(movieQuery)
    const skeletons = [1, 2, 3, 4, 5, 6]; // render six skeleton cards

    if (error) return <Text>{error}</Text>

    return (
        <>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={3}>
                {loading && skeletons.map(skeleton =>
                    <MovieCardContainer key={skeleton}>
                        <MovieCardSkeleton />
                    </MovieCardContainer>
                )}
                {data.map(movie =>
                    <MovieCardContainer key={movie._id}>
                        <MovieCard movie={movie} />
                    </MovieCardContainer>
                )}
            </SimpleGrid>
        </>
    )
}

export default MovieGrib