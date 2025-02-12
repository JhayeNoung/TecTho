import { Button, List } from "@chakra-ui/react"

import useGenre, { Genre } from "@/hooks/useGenre"

interface Props {
    onClick: (genre: Genre) => void;
    selectedGenre: Genre | null;
}

export default function GenreList({ onClick, selectedGenre }: Props) {
    const { data } = useGenre()

    return (
        <List.Root variant={"plain"}>
            {data.map(d =>
                <List.Item key={d._id}>
                    <Button
                        fontWeight={d._id === selectedGenre?._id ? "bold" : "normal"}
                        variant={"plain"}
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => onClick(d)}
                    >
                        {d.name}
                    </Button>
                </List.Item>
            )}
        </List.Root>
    )
}
