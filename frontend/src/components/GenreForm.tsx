import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const schemaGenre = z.object({
    title: z.string().min(1),
});

type Genre = z.infer<typeof schemaGenre>;

export default function GenreForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<Genre>({resolver: zodResolver(schemaGenre)});

    const onSubmit: SubmitHandler<Genre> = (data) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Genre</h1>
            <div className="mb-3">
                <label htmlFor="title">Enter your title: </label>
                <input {...register('title', { required: true })} type="text" name="title" id="title"  className="form-control"/>
                {errors.title?.message && <p className="text-danger">{errors.title?.message}</p>}
            </div>
            <div className="mb-3">
                <input type="submit" value="Submit" />
            </div>
        </form>    
    )
}
