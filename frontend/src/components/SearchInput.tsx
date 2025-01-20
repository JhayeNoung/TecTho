import { Input } from "@chakra-ui/react"
import { FieldValues, useForm } from "react-hook-form"
import { InputGroup } from "./ui/input-group";
import { LuSearch } from "react-icons/lu";

interface Props {
  submitHandler: (data: FieldValues) => void;
}

function SearchInput({ submitHandler }: Props) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputGroup startElement={<LuSearch />} width='full'>
        <Input {...register('searchName')} placeholder="Search movies ... " borderRadius='full' />
      </InputGroup>
    </form>
  )
}

export default SearchInput