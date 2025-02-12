"use client"

import { useRef, useState } from "react"
import { Input, Stack } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"
import {
  DialogCloseTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"

import { Movie } from "@/hooks/useMovie"
import apiMovie from "@/services/api-movie"
import useGenre from "../hooks/useGenre";
import { useUserStore } from "@/context/useUserStore"
import { useMovieStore } from "@/context/useMovieStore"
import AlertMessage from "./AlertMessage"

interface Props {
  children: React.ReactNode
  movie: Movie
}

const MovieUpdateForm = ({ movie }: { movie: Movie }) => {
  const { register, handleSubmit } = useForm<Movie>();
  const [alert, setAlert] = useState("");
  const { data: genres } = useGenre();
  const { accessToken } = useUserStore();
  const { updateActions } = useMovieStore();

  const onSubmit = async (formData: Movie) => {
    setAlert("");

    const payload = {
      title: formData.title,
      numberInStock: formData.numberInStock || "",
      dailyRentalRate: formData.dailyRentalRate || "",
      genre: formData.genre || movie.genre._id,
    }

    await apiMovie.put(`/movies/${movie._id}`, payload, {
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json" // set content type to json
      }
    })
      .then(() => {
        updateActions(["movie-update"]);
        setAlert("Movie updated successfully");
      })
      .catch((error: any) => {
        setAlert(error.response.data);
      })
  }

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody pb="4">
          <Stack gap="4">
            <Field label="Title">
              <Input {...register("title")} placeholder={`${movie.title}`} />
            </Field>
            <Field label="Number in Stock">
              <Input {...register("numberInStock", { valueAsNumber: true })} placeholder={`${movie.numberInStock}`} />
            </Field>
            <Field label="Daily Rental Rate">
              <Input {...register("dailyRentalRate", { valueAsNumber: true })} placeholder={`${movie.dailyRentalRate}`} />
            </Field>
            <Field label="Choose Genres">
              <select {...register("genre")} className="custom-form-select" id="genre">
                <option value="">Genres</option>
                {genres.map(genre => <option value={genre._id} key={genre._id}>{genre.name}</option>)}
              </select>
            </Field>
          </Stack>
        </DialogBody >
        <DialogFooter>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </>
  );
}

const MovieUpdate = ({ children, movie }: Props) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <DialogRoot initialFocusEl={() => ref.current}>
      <DialogTrigger asChild>
        <Button variant="plain" _hover={{ color: "cyan" }} color="blue">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Movie Updating</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <MovieUpdateForm movie={movie} />
      </DialogContent>
    </DialogRoot>
  )
}

export default MovieUpdate