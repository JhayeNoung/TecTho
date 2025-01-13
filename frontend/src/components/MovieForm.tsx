import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import { uploadFile, deleteFile } from "@/media/FileHandling";
import movieService from "@/services/movie-service";
import useGenre from "../hooks/useGenre";
import { Alert } from "./ui/alert";

export interface PostMovie {
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": string,
    "poster": string | null,
}

export interface Error {
    message: string,
}

const schemaMovie = z.object({
    title: z.string().min(1),
    numberInStock: z.number({ invalid_type_error: "Stock must be a number", }).nonnegative(),
    dailyRentalRate: z.number({ invalid_type_error: "Rate must be a number", }).nonnegative(),
    genre: z.string().min(1, { message: "You have to choose a genera" }),
    poster: z
        .instanceof(File)
        .refine(
            (file) =>
                [
                    "image/jpeg",
                ].includes(file.type),
            { message: "Invalid image file type" }
        )
});

type Movie = z.infer<typeof schemaMovie>;

export default function MovieForm() {
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<Movie>({ resolver: zodResolver(schemaMovie) });
    const { data: genres } = useGenre()
    const [message, setMessage] = useState<string | null>(null);

    const handleFormSubmit = async (movie: Movie) => {
        console.log(movie);

        // upload directly the file from input to S3, get the poster string
        const posterUrl = await uploadFile(movie.poster);

        // save the input data to backend
        await movieService
            .post<PostMovie>({ ...movie, poster: posterUrl }) // add poster string
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    setMessage("Successfully Submit")
                    setTimeout(() => setMessage(null), 3000); // Clears after 3 seconds
                }
            })
            .catch(error => {
                console.log(error.response.data)
                deleteFile(movie.poster) // if saving data to backend failed, delete upload file to s3
                setMessage(`${error.response.data}`)
                setTimeout(() => setMessage(null), 5000); // Clears after 3 seconds
            })
    };

    return (
        <>
            {message && (<Alert status="success" mb={4}>{message}</Alert>)}

            <form onSubmit={handleSubmit(handleFormSubmit)}>

                <h1>Movie Form</h1>

                <div className="mb-3">
                    <label htmlFor="title" className="from-label">Enter Title: </label>
                    <input {...register('title')} type="text" name="title" id="title" className="form-control" />
                    {errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="numberInStock" className="from-label">Enter Number In Stock: </label>
                    <input {...register('numberInStock', { valueAsNumber: true })} type="text" name="numberInStock" id="numberInStock" className="form-control" />
                    {errors.numberInStock?.message && <p className="text-danger">{errors.numberInStock?.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="dailyRentalRate" className="from-label">Enter Daily Rental Rate: </label>
                    <input {...register('dailyRentalRate', { valueAsNumber: true })} type="text" name="dailyRentalRate" id="dailyRentalRate" className="form-control" />
                    {errors.dailyRentalRate?.message && <p className="text-danger">{errors.dailyRentalRate?.message}</p>}
                </div>

                {/* 
                "useForm" doesn't separately handle 'File' format, so we will need to grab the file from "e.target" 
                and set the value with "setValue"
            */}
                <div className="mb-3">
                    <label htmlFor="poster" className="from-label">Enter poster file: </label>
                    <input
                        onChange={(e) => {
                            // if file is not null, invoke setValue()
                            // "poster" inside setValue look for "name" attribute(prop) of input tag
                            const file = e.target.files?.[0];
                            if (file) setValue("poster", file);
                        }}
                        type="file"
                        name="poster"
                        id="poster"
                        className="form-control"
                        accept="image/png, image/jpeg"
                    />
                    {errors.poster?.message && <p className="text-danger">{errors.poster?.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="genre" className="from-label">Genres</label>
                    <select {...register("genre")} className="form-select" id="genre">
                        <option value="">Choose Genres</option>
                        {genres.map(genre => <option value={genre._id} key={genre._id}>{genre.name}</option>)}
                    </select>
                    {errors.genre?.message && <p className="text-danger">{errors.genre?.message}</p>}
                </div>

                <div className="mb-3">
                    <button className="btn btn-primary" type="submit" value={"Post"}>Post</button>
                </div>
            </form>
        </>
    )
}
