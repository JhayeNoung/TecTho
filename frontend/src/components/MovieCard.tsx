import { Card, CardBody, Image, HStack } from '@chakra-ui/react'
import { Movie } from '@/hooks/useMovie'
import MetacriticBadge from './MetacriticBadge'

interface Props {
    movie: Movie
}

function MovieCard({ movie }: Props) {
    return (
        <Card.Root>
            {movie.poster_url.endsWith(".mp4") ? (
                <video controls width="100%">
                    <source src={movie.poster_url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <Image src={movie.poster_url} alt="Movie Poster" />
            )}

            <CardBody>
                <HStack justify={'flex-end'}>
                    <MetacriticBadge name={"In Stock"} score={movie.numberInStock} />
                    <MetacriticBadge name={"Rental Rate"} score={movie.dailyRentalRate} />
                </HStack>
                <Card.Title key={movie._id} fontSize={20}>{movie.title}</Card.Title>
            </CardBody>
        </Card.Root>
    )
}

export default MovieCard