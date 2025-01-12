import { Card, CardBody, Image, HStack } from '@chakra-ui/react'
import { Movie } from '@/hooks/useMovie'
import MetacriticBadge from './MetacriticBadge'
import { optimizedImage } from '@/helper/image-optimization'

interface Props {
    movie: Movie
}

function MovieCard({ movie }: Props) {
    return (
        <Card.Root>
            <Image src={movie.poster} />
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