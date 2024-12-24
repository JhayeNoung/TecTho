import logo from '../assets/logo.webp'
import { HStack, Image} from '@chakra-ui/react'
import SearchInput from './SearchInput';

interface Props{
  onSearch: (searchValue: string) => void;
}

export default function NavBar({onSearch}: Props) {
  return (
    <HStack>
        <Image src={logo} boxSize="60px"/>
        <SearchInput submitHandler={(event)=>onSearch(event.searchName)}/>
    </HStack>
  )
}
