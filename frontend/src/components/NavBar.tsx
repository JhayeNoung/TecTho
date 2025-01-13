import logo from '../assets/logo.webp'
import { HStack, Image } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

import SearchInput from './SearchInput';
import DarkMode from './DarkMode';

interface Props {
  onSearch: (searchValue: string) => void;
}

export default function NavBar({ onSearch }: Props) {
  return (
    <HStack padding='10px'>

      <NavLink to="/" end>
        <Image src={logo} boxSize="60px" />
      </NavLink>

      <Box width="full" >
        <SearchInput submitHandler={(event) => onSearch(event.searchName)} />
      </Box>

      <NavLink to="/registration">
        <Button variant="plain" _hover={{ textDecoration: "underline" }}>
          User API
        </Button>
      </NavLink>

      <NavLink to="/api" end>
        <Button variant="plain" _hover={{ textDecoration: "underline" }}>
          Movie API
        </Button>
      </NavLink>

      <DarkMode />
    </HStack >
  )
}
