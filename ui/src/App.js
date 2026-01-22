import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MovieEditForm from "./MovieEditForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [editingMovie, setEditingMovie] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };
        fetchMovies();
    }, []);

    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const addedMovie = await response.json();
            setMovies(prev => [...prev, addedMovie]);
            setAddingMovie(false);
        }
    }

    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies)
        }
    }

    async function handleEditMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'PUT',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            setMovies(prev => prev.map(m => (m.id === movie.id ? { ...m, ...movie } : m)));
            setEditingMovie(false);
            setMovieToEdit(null);
        } else {
            const errText = await response.text();
            console.error("Edit failed:", errText);
        }
    }

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList 
                    movies={movies}
                    onEditMovie={(movie) => {
                        setMovieToEdit(movie);
                        setEditingMovie(true);
                        }
                    }
                    onDeleteMovie={handleDeleteMovie}
                />
            }
            {editingMovie && (
                <MovieEditForm 
                    movie={movieToEdit}
                    onMovieEdit={handleEditMovie}
                    buttonLabel="Edit a movie"
                /> 
                )
            }

            {addingMovie
                ? <MovieForm 
                    onMovieSubmit={handleAddMovie}
                    buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
        </div>
    );
}

export default App;