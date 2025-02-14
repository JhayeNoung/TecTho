import { useState } from "react";
import { z } from "zod";

import { logError, logActionError } from "@/services/log-error";
import { useMovieStore } from "@/context/useMovieStore";
import { useUserStore } from "@/context/useUserStore";
import { Genre } from "./useGenre";
import useData from "./useData";
import apiMovie from "@/services/api-movie";

export interface FetchMovie {
    "_id": string,
    "title": string,
    "numberInStock": number,
    "dailyRentalRate": number,
    "genre": Genre,
    "poster_url": string,
    "video_url": string,
}

export interface MovieQuery {
    page: number,
    genre: Genre,
    search: string,
    ordering: string,
}

export const schemaMovie = z.object({
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

export type FormMovie = z.infer<typeof schemaMovie>;


export const useMovie = (movieQuery?: MovieQuery) => useData<FetchMovie>(
    apiMovie,
    '/movies',
    { params: { page: movieQuery?.page, genre: movieQuery?.genre?._id, search: movieQuery?.search, ordering: movieQuery?.ordering } },
    [movieQuery]
)

export const useMovieActions = () => {
    const [alert, setAlert] = useState("");
    const { updateActions } = useMovieStore();
    const [loading, setLoading] = useState(false);
    const { accessToken } = useUserStore();

    const handleCreate = async (payload: FormMovie) => {
        setAlert(""); // Reset the alert
        setLoading(true);

        try {
            // Get the pre-signed URL from the backend
            const presigned_poster = await apiMovie.post('/presigned-url/post-url', { name: payload.poster.name, type: payload.poster.type });
            const presigned_video = await apiMovie.post('/presigned-url/post-url', { name: payload.video.name, type: payload.video.type });

            // send the payload to the backend
            const { poster, video, ...rest } = payload; // Separate the poster file from the payload
            await apiMovie.post(`/movies`, { ...rest, poster_url: payload.poster.name, video_url: payload.video.name }, {
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
                headers: { 'Content-Type': payload.video.type },
                body: payload.video,
            });

            // Update the actions in the store
            updateActions(["movie-post"]);

            setLoading(false);
            setAlert("Movie posted successfully");
        }
        // Handle the error
        catch (error: any) {
            setLoading(false);
            logError(error, setAlert);
        }
    };

    const handleDelete = async (movie: FetchMovie) => {
        setAlert(""); // Reset the alert
        setLoading(true);

        try {
            const poster_key = movie.poster_url.split('com/')[1]
            const presigned_poster = await apiMovie.post('/presigned-url/delete-url', { KEY: poster_key });

            const video_key = movie.video_url.split('com/')[1]
            const presigned_video = await apiMovie.post('/presigned-url/delete-url', { KEY: video_key });

            const response = await apiMovie.delete(`/movies/${movie._id}`, {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            // Delete the file from S3 using the pre-signed URL after the movie is successfully deleted
            await fetch(presigned_poster.data.url, {
                method: 'DELETE',
            });

            // Delete the file from S3 using the pre-signed URL after the movie is successfully deleted
            await fetch(presigned_video.data.url, {
                method: 'DELETE',
            });

            // Update the actions in the store
            updateActions(["movie-delete"]);
            setLoading(false);
            setAlert(response.data.message);
        }
        catch (error: any) {
            logActionError(error)
        }
    };

    const handleUpdate = async (movie: FetchMovie, payload: FetchMovie,) => {
        setAlert("");
        setLoading(true);

        try {
            const data = {
                title: payload.title,
                numberInStock: payload.numberInStock || "",
                dailyRentalRate: payload.dailyRentalRate || "",
                genre: payload.genre || movie.genre._id,
            }

            await apiMovie.put(`/movies/${movie._id}`, data, {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "application/json" // set content type to json
                }
            })

            updateActions(["movie-update"]);
            setLoading(false);
            setAlert("Movie updated successfully");
        }
        catch (error: any) {
            setLoading(false);
            logActionError(error)
        }
    }

    return { alert, loading, handleCreate, handleDelete, handleUpdate };
}