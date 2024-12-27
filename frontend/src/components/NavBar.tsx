import logo from '../assets/logo.webp'
import { HStack, Image} from '@chakra-ui/react'
import SearchInput from './SearchInput';
import DarkMode from './DarkMode';

interface Props{
  onSearch: (searchValue: string) => void;
}

export default function NavBar({onSearch}: Props) {
  return (
    <HStack justifyContent='space-between' padding='10px'>
        <Image src={logo} boxSize="60px"/>
        <SearchInput submitHandler={(event)=>onSearch(event.searchName)}/>
        <DarkMode/>
    </HStack>
  )
}
