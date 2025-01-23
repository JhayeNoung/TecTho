import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, Fieldset, Stack } from "@chakra-ui/react";
import { Field } from "./ui/field";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import apiMovie from "../services/api-movie";

import useGenre from "../hooks/useGenre";
import AlertMessage from "./AlertMessage";
import { useUserStore } from "@/context/useUserStore";

const schemaMovie = z.object({
  title: z.string().min(1).max(255),
  numberInStock: z.number({ invalid_type_error: "Number in stock must be a number" }).max(300).nonnegative(),
  dailyRentalRate: z.number({ invalid_type_error: "Rate must be a number" }).max(300).nonnegative(),
  genre: z.string().min(1, { message: "You have to choose a genre" }),
  poster: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/png"
        ].includes(file.type),
      { message: "Invalid image file type" }
    ),
  video: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "video/mp4"
        ].includes(file.type),
      { message: "Invalid video file type" }
    ),
});

type Movie = z.infer<typeof schemaMovie>;

export default function MovieForm() {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<Movie>({ resolver: zodResolver(schemaMovie) });
  const { data: genres } = useGenre();
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false)
  const { accessToken } = useUserStore();

  const handleFormSubmit = async (payload: Movie) => {
    setAlert(""); // Reset the alert
    setLoading(true);

    try {
      // Get the pre-signed URL from the backend
      const presigned_poster = await apiMovie.post('/presigned-url/post-url', { name: payload.poster.name, type: payload.poster.type });
      const poster_url = presigned_poster.data.url.split('?')[0];

      const presigned_video = await apiMovie.post('/presigned-url/post-url', { name: payload.video.name, type: payload.video.type });
      const video_url = presigned_video.data.url.split('?')[0];

      // send the payload to the backend
      const { poster, video, ...rest } = payload; // Separate the poster file from the payload
      await apiMovie.post(`/movies`, { ...rest, poster_url, video_url }, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json"
        }
      })

      // Upload the file to S3 using the pre-signed URL after the movie is successfully posted
      await fetch(presigned_poster.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': payload.poster.type },
        body: payload.poster,
      });

      // Upload the file to S3 using the pre-signed URL after the movie is successfully posted
      await fetch(presigned_video.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': payload.poster.type },
        body: payload.video,
      });

      window.dispatchEvent(new Event("movie-post")); // Dispatch an event to notify the MovieList component

      setAlert("Movie posted successfully");
      setLoading(false);
    }
    // Handle the error
    catch (error: any) {
      console.log(error)
      switch (error.response?.status) {
        case 404:
          if (error.response.data.includes("No genre found.")) {
            setAlert("No genre found.");
          } else {
            setAlert("The requested resource was not found. status code: 404");
          }
          break;
        case 400:
          if (error.response.data.includes("Already have movie with this title.")) {
            setAlert("Already have movie with this title.");
          } else {
            setAlert(error.response.data);
          }
          break;
        case 401:
        case 403:
          setAlert(error.response.data);
          break;
        case 500:
          setAlert(error.message);
          break;
        default:
          window.alert("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
