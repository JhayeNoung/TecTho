import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from "@chakra-ui/react";

import { uploadFile, deleteFile } from "@/services/aws-service";
import movieService from "@/services/movie-service";
import useGenre from "../hooks/useGenre";
import AlertMessage from "./AlertMessage";

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

  const handleFormSubmit = async (payload: Movie) => {
    console.log("Payload", payload);

    setAlert(""); // reset the alert message when submitting the form, which make sure duplicate value is not set, if duplicate value is set, alert state will be the same

    // upload the file to S3 and get the URL of the uploaded file 
    const poster_url = await uploadFile(payload.poster);
    console.log("AWS", poster_url);

    // remove poster from payload, because we don't need to send it to the backend
    const { poster, ...rest } = payload;

    // send the payload to the backend
    await movieService
      .post({ ...rest, poster_url })
      .then(response => {
        console.log("Backend Response", response)
        setAlert("Movie added successfully.");
      })
      .catch(error => {
        console.log(error);
        switch (error.status) {
          case 404:
            if (error.response.data.includes("No genre found.")) {
              setAlert("No genre found.");
            } else {
              setAlert("The requested resource was not found. status code: 404");
            }
            break;
          case 401:
          case 400:
          case 403:
            setAlert(error.response.data);
            break;
          case 500:
            setAlert(error.message);
            break;
          default:
            window.alert("An unexpected error occurred");
        }
      })
  };

  return (
    <>
      {alert && <AlertMessage message={alert} />}

      <form onSubmit={handleSubmit(handleFormSubmit)}>

        <h1>Movie Form</h1>

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

        <Button type="submit">Post</Button>
      </form>
    </>
  )
}
