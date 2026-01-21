import {useState} from "react";

export default function MovieEditForm(props) {
    const [id, setId] = useState(props.movie.id);
    const [title, setTitle] = useState(props.movie.title);
    const [year, setYear] = useState(props.movie.year);
    const [director, setDirector] = useState(props.movie.director);
    const [actors, setActors] = useState(props.movie.actors);
    const [description, setDescription] = useState(props.movie.description);

    function editMovie(event) {
        event.preventDefault();
        if (title.length < 2) {
            return alert('Tytuł jest za krótki');
        }
        props.onMovieEdit({id, title, year, director, actors, description});
        console.log(id)
        console.log(title)
        console.log(props.movie)
        setId('');
        setTitle('');
        setYear('');
        setDirector('');
        setActors('');
        setDescription('');
    }

    return <form onSubmit={editMovie}>
        <h2>Edit movie</h2>
        <div>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        <div>
            <label>Actors</label>
            <input type="text" value={actors} onChange={(event) => setActors(event.target.value)}/>
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}
