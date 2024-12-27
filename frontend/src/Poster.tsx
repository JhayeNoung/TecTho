import useMovie from './hooks/useMovie'

export default function Poster() {
    const { data: movies } = useMovie()

    return (
        <>
            {movies.map(movie=>
                <>
                <h2>{movie.title}</h2>
                <p>{movie.genre.name}</p>
                <img src={movie.poster} alt={`${movie.title} Poster`} style={{ width: "300px" }} />
                <p>{movie.poster}</p>
                </>
            )}
        </>
    );
}
