import { Badge } from '@chakra-ui/react'

interface Prop {
    name: string
    score: number,
}

function MetacriticBadge({ name, score }: Prop) {
    let color = score > 75 ? 'green' : score > 60 ? 'yellow' : 'red';

    return (
        <Badge colorPalette={color} paddingX={2} fontSize='14px'>{name}{score}</Badge>
    );
}

export default MetacriticBadge;