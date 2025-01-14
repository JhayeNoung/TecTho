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
  title: z.string().min(1),
  numberInStock: z.number({ invalid_type_error: "Number in stock must be a number" }).nonnegative(),
  dailyRentalRate: z.number({ invalid_type_error: "Rate must be a number" }).nonnegative(),
  genre: z.string().min(1, { message: "You have to choose a genre" }),
  poster: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/jpeg",
        ].includes(file.type),
      { message: "Invalid image file type" }
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

  const handleFormSubmit = async (payload: Movie) => {
    setAlert(""); // Reset the alert
    setLoading(true);
    const { poster, ...rest } = payload; // Separate the poster from the payload

    // Try to post the movie and upload the poster
    try {
      // Get the pre-signed URL from the backend
      const presigned_response = await apiMovie.post('/presigned-url/post-url', { fileName: payload.poster.name });
      const poster_url = presigned_response.data.url.split('?')[0];

      // send the payload to the backend
      await apiMovie.post("/movies", { ...rest, poster_url })

      // Upload the file to S3 using the pre-signed URL after the movie is successfully posted
      await fetch(presigned_response.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': payload.poster.type },
        body: payload.poster,
      });

      setAlert("Movie posted successfully");
      setLoading(false);
    }
    // Handle the error
    catch (error: any) {
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
            setAlert("Invalid request. status code: 400");
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
          <label htmlFor="poster" className="from-label">Choose File</label>
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
