import { DialogFooter, HStack, Image, Grid, GridItem, Spacer, Button, Box, NativeSelectField, NativeSelectRoot, Input, Fieldset, Stack, Table, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow, Spinner } from '@chakra-ui/react'
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import { useMovie, schemaMovie, FetchMovie, FormMovie, useMovieActions } from "@/hooks/useMovie";
import { MovieQuery } from '@/hooks/useMovie';
import { useUserStore } from '@/context/useUserStore';
import DarkMode from '../components/DarkMode';
import logo from '../assets/logo.webp'
import GenreSelector from '@/components/GenreSelector';
import SortSelector from '@/components/SortSelector';
import AlertMessage from '@/components/AlertMessage';
import useGenre from "../hooks/useGenre";
import JsonViewer from '@/components/JsonViewer';
import Dialog from '@/components/Dialog';

const MovieUpdateForm = ({ movie }: { movie: FetchMovie }) => {
  const { register, handleSubmit } = useForm<FetchMovie>();
  const { data: genres } = useGenre();
  const { alert, handleUpdate } = useMovieActions();

  const onSubmit = async (payload: FetchMovie) => {
    handleUpdate(movie, payload)
  }

  return (
    <>
      {alert && <AlertMessage message={alert} />}
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <DialogFooter>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </>
  );
}

function MovieAction({ movie }: { movie: FetchMovie }) {
  const { accessToken } = useUserStore();
  const { handleDelete } = useMovieActions();

  const onClick = async () => {
    handleDelete(movie)
  };

  return (
    <>
      {accessToken ?
        <HStack>
          <Dialog document='Movie' action='edit'><MovieUpdateForm movie={movie} /></Dialog>
          <Dialog document='Movie' action='detail'><JsonViewer data={movie} /></Dialog>
          <Button variant="plain" _hover={{ color: "cyan" }} color="red" onClick={onClick}>
            Delete
          </Button>
        </HStack>
        :
        <HStack>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Edit
          </Button>
          <Dialog document='Movie' action='detail'><JsonViewer data={movie} /></Dialog>
          <Button variant="plain" _hover={{ textDecoration: "underline" }} color="grey" onClick={() => window.alert("Please login to perform this action")}>
            Delete
          </Button>
        </HStack>
      }
    </>
  )
}

const MovieList = () => {
  const { data: movies, error, loading } = useMovie();
  const { alert } = useMovieActions();

  return (
    <>
      <Table.ScrollArea borderWidth="1px" rounded="md" height="560px">
        <TableRoot stickyHeader>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>Title</TableColumnHeader>
              <TableColumnHeader>Stock</TableColumnHeader>
              <TableColumnHeader>Rental Rate</TableColumnHeader>
              <TableColumnHeader>Genre</TableColumnHeader>
            </TableRow>
          </TableHeader>


          <TableBody>
            {loading &&
              <TableRow>
                <TableCell><Spinner /></TableCell>
              </TableRow>}

            {error && <p>{error}</p>}

            {alert && <AlertMessage message={alert} />}

            {movies.map(movie =>
              <TableRow key={movie._id}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.numberInStock}</TableCell>
                <TableCell>{movie.dailyRentalRate}</TableCell>
                <TableCell>{movie.genre.name}</TableCell>
                <TableCell><MovieAction movie={movie} /></TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
      </Table.ScrollArea>
    </>
  )
}

const MovieForm = () => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormMovie>({ resolver: zodResolver(schemaMovie) });
  const { data: genres } = useGenre();
  const { handleCreate, loading, alert } = useMovieActions();

  const onSubmit = async (payload: FormMovie) => {
    handleCreate(payload)
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <Stack>
            <Fieldset.Legend>Movie Form</Fieldset.Legend>
            <Fieldset.HelperText>
              Please provide movie details below.
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>

            <Field label="Title">
              <Input {...register('title', { required: true })} type="text" placeholder="Title..." />
              {errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
            </Field>

            <Field label="Number In Stock">
              <Input {...register('numberInStock', { required: true, valueAsNumber: true })} type="text" placeholder="1..." />
              {errors.numberInStock?.message && <p className="text-danger">{errors.numberInStock?.message}</p>}
            </Field>

            <Field label="Daily Rental Rate">
              <Input {...register('dailyRentalRate', { required: true, valueAsNumber: true })} type="text" placeholder="1..." />
              {errors.dailyRentalRate?.message && <p className="text-danger">{errors.dailyRentalRate?.message}</p>}
            </Field>

            <Field label="Poster File">
              <input
                type="file"
                accept="image/jpeg, image/png"
                className="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("poster", file);
                }}
              />
              {errors.poster?.message && <p className="text-danger">{errors.poster?.message}</p>}
            </Field>

            <Field label="Video File">
              <input
                type="file"
                accept="video/mp4"
                className="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("video", file);
                }}
              />
              {errors.video?.message && <p className="text-danger">{errors.video?.message}</p>}
            </Field>

            <Field label="Genre">
              <NativeSelectRoot>
                <NativeSelectField {...register('genre', { required: true })} placeholder="Select genre">
                  {genres?.map((genre) => (<option key={genre._id} value={genre._id}> {genre.name} </option>))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>

          </Fieldset.Content>

          {!loading ? <Button type="submit">Submit</Button> : <Button disabled>Submiting...</Button>}

        </Fieldset.Root>

      </form>
    </>
  )
}

const NavBar = () => {
  const { accessToken } = useUserStore();
  return (
    <HStack padding='10px'>

      <NavLink to="/" end>
        <Image src={logo} boxSize="50px" />
      </NavLink>

      {/* Spacer pushes the rest of the components to the right */}
      <Spacer />

      {accessToken ?
        <NavLink to="/registration/logout">
          <Button variant="plain" _hover={{ textDecoration: "underline" }}>
            {localStorage.getItem("email")}
          </Button>
        </NavLink>
        :
        <NavLink to="/registration">
          <Button variant="plain" _hover={{ textDecoration: "underline" }}>
            User Panel
          </Button>
        </NavLink>
      }

      <Button variant="plain" fontWeight="bold">
        Movie Panel
      </Button>

      <DarkMode />
    </HStack>
  )
}

function MoviePanel() {
  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery)

  return (
    <Grid
      templateAreas={{
        base: `"nav" "form" "list"`,  // Stack nav, form, and list in one column for small screens
        lg: `"nav nav" "form list"`,  // In large screens, side by side
        md: `"nav" "form" "list"`,
        sm: `"nav" "form" "list"`,
      }}

      templateColumns={{
        base: '1fr', // 1 fraction for all elements in small screens (stacked)
        lg: '350px 1fr', // On large screens, side by side
        md: '1fr',
        sm: '1fr',
      }}
    >


      {/* Navigation Bar */}
      <GridItem area="nav">
        <NavBar />
      </GridItem>


      {/* Movie Form */}
      <GridItem area="form" padding={{ base: '3', lg: '3 3 3 3' }}>
        <Box padding="3" borderRadius="md" boxShadow="md">
          <MovieForm />
        </Box>
      </GridItem>


      {/* Movie List */}
      <GridItem area="list" padding={{ base: '3', lg: '3 3 3 3' }}>

        <Box paddingBottom={3}>
          <HStack>
            <GenreSelector onSelectedGenre={(genre) => setMovieQuery({ ...movieQuery, genre })} />
            <SortSelector selectedSortOrder={movieQuery.ordering} onSelectedSortOrder={(ordering) => setMovieQuery({ ...movieQuery, ordering })} />
          </HStack>
        </Box>

        <Box>
          <MovieList />
        </Box>
      </GridItem>

    </Grid>

  )
}

export default MoviePanel