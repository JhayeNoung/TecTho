
import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface Prop {
    children: ReactNode
}

function MovieCardContainer({ children }: Prop) {
    // borderRadius document is under Styling > Style Props > Border
    return (
        // GameCardSkeleton and GameCard will be the 'children' of GameCardContainer
        <Box borderRadius={10} overflow={'hidden'}>{children}</Box>
    )
}

export default MovieCardContainer