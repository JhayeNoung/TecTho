import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const schemaUser = z.object({
    name: z.string().min(10),
    email: z.string().email(),
});

type User = z.infer<typeof schemaUser>;

export default function UserForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<User>({resolver: zodResolver(schemaUser)});

    const onSubmit: SubmitHandler<User> = (data) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="name">Enter your name: </label>
                <input {...register('name', { required: true })} type="text" name="name" id="name"  className="form-control"/>
                {errors.name?.message && <p className="text-danger">{errors.name?.message}</p>}
            </div>
            <div className="mb-3">
                <label htmlFor="email">Enter your email: </label>
                <input {...register('email', { required: true })} type="email" name="email" id="email"  className="form-control"/>
                {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
            </div>
            <div className="mb-3">
                <input type="submit" value="Submit" />
            </div>
        </form>    
    )
}
