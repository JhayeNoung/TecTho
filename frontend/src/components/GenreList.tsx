import useGenre from "@/hooks/useGenre"
import { Button } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { Genre } from "@/hooks/useGenre"

interface Props{
    onClick: (selectValue: Genre) => void
}

export default function GenreList({onClick}: Props) {
    const { data, error, loading } = useGenre()

    return (
        <List.Root variant={"plain"}>
            {data.map(d=>
                <List.Item key={d._id}>
                    <Button 
                        variant={"plain"} 
                        _hover={{textDecoration: "underline"}} 
                        onClick={()=>onClick(d)}
                    >
                        {d.name}
                    </Button>
                </List.Item>
            )}
        </List.Root>
    )
}
