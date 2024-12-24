import { Button } from '@chakra-ui/react'

interface Props{
    onPageSelect: (selectPage: number) => void;
}

export default function PageBar({onPageSelect}: Props) {
  return (
    <>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(1)}>1</Button>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(2)}>2</Button>
    <Button variant={"plain"} _hover={{textDecoration: "underline"}} onClick={()=>onPageSelect(3)}>3</Button>
    </>

  )
}
