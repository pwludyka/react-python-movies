export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <div>
                    <strong>{props.movie.title}</strong>
                    {' '}
                    <span>({props.movie.year})</span>
                    {' '}
                    directed by {props.movie.director}
                    {' '}
                    cast {props.movie.actors}
                    {' '}
                </div>
                {props.movie.description}
            </div>
            <div>              
                <a onClick={props.onEdit}>Edit</a>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
        </div>
    );
}
