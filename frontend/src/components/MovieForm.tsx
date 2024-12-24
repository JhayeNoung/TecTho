import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import useGenre from "../hooks/useGenre";

const schemaMovie = z.object({
    title: z.string().min(1),
    numberInStock: z.number({invalid_type_error: "Stock must be a number",}).nonnegative(),
    dailyRentalRate: z.number({invalid_type_error: "Rate must be a number",}).nonnegative(),
    genre: z.string().min(1, {message: "You have to choose a genera"}),
    poster: z.string()
});

type Movie = z.infer<typeof schemaMovie>;

interface Props{
    onSubmit: (data: Movie) => void;
}

export default function MovieForm({onSubmit}: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<Movie>({resolver: zodResolver(schemaMovie)});
    const {data} = useGenre()

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <h1>Movie Form</h1>

            <div className="mb-3">
                <label htmlFor="title" className="from-label">Enter Title: </label>
                <input {...register('title')} type="text" name="title" id="title"  className="form-control"/>
                {errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="numberInStock" className="from-label">Enter Number In Stock: </label>
                <input {...register('numberInStock', {valueAsNumber: true})} type="text" name="numberInStock" id="numberInStock"  className="form-control"/>
                {errors.numberInStock?.message && <p className="text-danger">{errors.numberInStock?.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="dailyRentalRate" className="from-label">Enter Daily Rental Rate: </label>
                <input {...register('dailyRentalRate', {valueAsNumber: true})} type="text" name="dailyRentalRate" id="dailyRentalRate"  className="form-control"/>
                {errors.dailyRentalRate?.message && <p className="text-danger">{errors.dailyRentalRate?.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="poster" className="from-label">Enter poster file: </label>
                <input {...register('poster')} type="text" name="poster" id="poster"  className="form-control"/>
                {errors.poster?.message && <p className="text-danger">{errors.poster?.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="genre" className="from-label">Genres</label>
                <select {...register("genre")} className="form-select" id="genre">
                    <option value="">Choose Genres</option>
                    {data.map(d=><option value={d._id} key={d._id}>{d.name}</option>)}
                </select>
                {errors.genre?.message && <p className="text-danger">{errors.genre?.message}</p>}
            </div>
            
            <div className="mb-3">
                <button className="btn btn-primary" type="submit" value={"Post"}>Post</button>
            </div>
        </form>    
    )
}
