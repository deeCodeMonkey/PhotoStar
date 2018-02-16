import React from 'react';
import { Link } from 'react-router-dom';

const PhotoItem = (props) => {

    truncateText = (text, length) => {
        let newText = text.substring(0, length);
        if (text.length > 150) {
            return `${newText} ...`;
        }
        return `${newText}`;
    }

    return (
        <div className="row photo-row">
            <div className="col-md-2">
                <img className="img-thumbnail" src={props.photo.file} />
            </div>
            <div className="col-md-10">
                <h4>{props.photo.name}</h4>
                <p>Average Rating: Rating</p>
                <p>{truncateText(props.photo.description, 150)}</p>
                <Link to={`/review/${props.photo._id}`} className="btn btn-default">Read Reviews</Link>
                <Link to={`/review/add/${props.photo.name}/${props.photo._id}`} className="btn btn-primary">Add Review</Link>
            </div>
        </div>
    );
}

export default PhotoItem;