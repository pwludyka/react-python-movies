import {useState, useEffect} from "react";

export default function MovieEditForm(props) {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [actors, setActors] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!props.movie) return;
        setId(props.movie.id ?? '');
        setTitle(props.movie.title ?? '');
        setYear(String(props.movie.year) ?? '');
        setDirector(props.movie.director ?? '');
        setActors(props.movie.actors ?? '');
        setDescription(props.movie.description ?? '');
    }, [props.movie]);

    function editMovie(event) {
        event.preventDefault();
        if (title.length < 2) {
            return alert('Tytuł jest za krótki');
        }
        
        {(!props.movie)
            ? props.onMovieSubmit({title, year: String(year), director, actors, description})
            : props.onMovieSubmit({id, title, year: String(year), director, actors, description})};

        setId('');
        setTitle('');
        setYear('');
        setDirector('');
        setActors('');
        setDescription('');
    }

    return <form onSubmit={editMovie}>
        <h2>{props.buttonLabel}</h2>
        <div>
            <label>Title</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        {!props.movie && (
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        )}
        {!props.movie && (
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        )}
        {!props.movie && (        
        <div>
            <label>Actors</label>
            <input type="text" value={actors} onChange={(event) => setActors(event.target.value)}/>
        </div>
        )} 
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}