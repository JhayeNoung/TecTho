import useGenre from "../hooks/useGenre"

interface Props{
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}


export default function GenreFilter({onChange}: Props) {
    const {data} = useGenre()

    return (
        <>
            <h1 className="mb-3">Movie List</h1>
            <select className="form-select mb-3" id="genre" onChange={(e)=>onChange(e)}>
                <option value="">--- All Genres ---</option>
                {data.map((d)=><option value={d._id} key={d._id}>{d.name}</option>)}
            </select>
        </>
    )   
}
