import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from "@chakra-ui/react";

import useGenre from "../hooks/useGenre";
import AlertMessage from "./AlertMessage";
import apiMovie from "@/services/api-movie";

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


/*
Hybrid Upload is used to upload file in this MovieForm component:

1.  Frontend Request for Pre-signed URL:
    The frontend sends file metadata (e.g., file type, size) to the backend.

2.  Backend Generates Pre-signed URL:
    The backend validates the request and returns a pre-signed URL.

3.  Frontend Uploads to S3:
    The frontend uses the pre-signed URL to upload the file directly to S3.

4.  Backend Logs Metadata:

The backend receives metadata from the frontend after the successful upload for storage or processing.
*/

export default function MovieForm() {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<Movie>({ resolver: zodResolver(schemaMovie) });
  const { data: genres } = useGenre();
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false)
  const storedToken = localStorage.getItem('token');

  const handleFormSubmit = async (payload: Movie) => {
    setAlert(""); // Reset the alert
    setLoading(true);

    // Try to post the movie and upload the poster
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
          Authorization: `${storedToken}`,
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
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...register('title', { required: true })} type="text" placeholder="La La Land" />
          {errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="numberInStock">Number In Stock</FormLabel>
          <Input id="numberInStock" {...register('numberInStock', { required: true, valueAsNumber: true })} type="text" placeholder="1..." />
          {errors.numberInStock?.message && <p className="text-danger">{errors.numberInStock?.message}</p>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="dailyRentalRate">Daily Rental Rate</FormLabel>
          <Input id="dailyRentalRate" {...register('dailyRentalRate', { required: true, valueAsNumber: true })} type="text" placeholder="1..." />
          {errors.dailyRentalRate?.message && <p className="text-danger">{errors.dailyRentalRate?.message}</p>}
        </FormControl>

        {/* "useForm" doesn't separately handle 'File' format, so we will need to grab the file from "e.target" and set the value with "setValue" */}
        <FormControl>
          <label htmlFor="poster" className="from-label">Choose Poster File</label>
          <input
            id="poster"
            onChange={(e) => {
              const file = e.target.files?.[0]; // get file objcet from the event
              if (file) setValue("poster", file); // set the value of poster with the file
            }}
            type="file"
            name="poster"
            className="form-control"
            accept="image/png, image/jpeg"
          />
          {errors.poster?.message && <p className="text-danger">{errors.poster?.message}</p>}
        </FormControl>

        <FormControl>
          <label htmlFor="video" className="from-label">Choose Video File</label>
          <input
            id="video"
            onChange={(e) => {
              const file = e.target.files?.[0]; // get file objcet from the event
              if (file) setValue("video", file); // set the value of video with the file
            }}
            type="file"
            name="video"
            className="form-control"
            accept="video/mp4"
          />
          {errors.video?.message && <p className="text-danger">{errors.video?.message}</p>}
        </FormControl>

        <FormControl>
          <label htmlFor="genre" className="from-label">Genres</label>
          <select {...register("genre")} className="form-select" id="genre">
            <option value="">Choose Genres</option>
            {genres.map(genre => <option value={genre._id} key={genre._id}>{genre.name}</option>)}
          </select>
          {errors.genre?.message && <p className="text-danger">{errors.genre?.message}</p>}
        </FormControl>

        {!loading ? <Button type="submit">Post</Button> : <Button disabled>Posting...</Button>}
      </form>
    </>
  )
}
