import { Movie } from "@/hooks/useMovie";
import { Genre } from "@/hooks/useGenre";

interface Props{
    movies: Movie[];
    selectedGenre: Genre | null;
}

export default function MovieList({movies, selectedGenre}: Props) {

    return (
        <table className="table mb-3">
            <thead>
                <tr>
                <th scope="col">Title</th>
                <th scope="col">Number In Stock</th>
                <th scope="col">Daily Rental Rate</th>
                <th scope="col">Genre</th>
                </tr>
            </thead>

            <tbody>
                {movies
                    .filter(movie => selectedGenre === null || movie.genre._id === selectedGenre._id)
                    .map(movie=>
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.numberInStock}</td>
                            <td>{movie.dailyRentalRate}</td>
                            <td>{movie.genre.name}</td>
                        </tr>
                )}
            </tbody>
        </table>    
    )
}
