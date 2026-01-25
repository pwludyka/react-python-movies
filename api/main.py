from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Union
from pydantic import BaseModel, field_validator
from typing import Any
import sqlite3


class Movie(BaseModel):
    title: str
    year: Union[str, int]
    director: str
    actors: str
    description: str

    @field_validator("year", mode="before") #solving one side of the year format bug on render.com
    def year_to_str(cls, v):
        return str(v)

app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")

@app.get('/movies')
def get_movies():  # put application's code here
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        movies = cursor.execute('SELECT * FROM movies')

        output = []
        for movie in movies:
            movie = {'id': movie[0], 'title': movie[1], 'year': str(movie[2]), 'actors': movie[3], 'director': movie[4], 'description': movie[5]}
            output.append(movie)

    return output

@app.get('/movies/{movie_id}')
def get_single_movie(movie_id:int):  # put application's code here
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        movie = cursor.execute(f"SELECT * FROM movies WHERE id={movie_id}").fetchone()
        if movie is None:
            return {'message': "Movie not found"}
        return {'id': movie[0], 'title': movie[1], 'year': str(movie[2]), 'actors': movie[3], 'director': movie[4], 'description': movie[5]}

@app.post("/movies")
def add_movie(movie: Movie):
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        cursor.execute(f"INSERT INTO movies (title, year, director, actors, description) VALUES ('{movie.title}', '{movie.year}', '{movie.director}', '{movie.actors}', '{movie.description}')")
        return {"id": cursor.lastrowid, 'title': movie.title, 'year': movie.year, 'director': movie.director, 'actors': movie.actors, 'description': movie.description}

@app.put("/movies/{movie_id}")
def update_movie(movie_id:int, movie: Movie):
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        cursor.execute("UPDATE movies SET title = ?, year = ?, director = ?, actors = ?, description = ? WHERE id = ?", (movie.title, movie.year, movie.director, movie.actors, movie.description, movie_id))
        if cursor.rowcount == 0:
            return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {cursor.lastrowid} updated successfully"}

@app.delete("/movies/{movie_id}")
def delete_movie(movie_id:int):
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
        if cursor.rowcount == 0:
            return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {movie_id} deleted successfully"}

@app.delete("/movies")
def delete_movies(movie_id:int):
    with sqlite3.connect('movies.db') as db:
        cursor = db.cursor()
        cursor.execute("DELETE FROM movies")
    return {"message": f"Deleted {cursor.rowcount} movies"}


# if __name__ == '__main__':
#     app.run()
