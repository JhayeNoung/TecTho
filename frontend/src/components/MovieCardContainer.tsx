
import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface Prop {
    children: ReactNode
}

function MovieCardContainer({ children }: Prop) {
    // borderRadius document is under Styling > Style Props > Border
    return (
        // GameCardSkeleton and GameCard will be the 'children' of GameCardContainer
        <Box>{children}</Box>
    )
}

export default MovieCardContainer