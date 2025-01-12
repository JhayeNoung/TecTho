import { Card, CardBody } from '@chakra-ui/react'
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

function MovieCardSkeleton() {
    return (
        <>
            <Card.Root>
                <Skeleton height="200px" />
                <CardBody>
                    <SkeletonText />
                </CardBody>
            </Card.Root>
        </>
    )
}

export default MovieCardSkeleton