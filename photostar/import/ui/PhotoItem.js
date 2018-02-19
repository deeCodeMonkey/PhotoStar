import React from 'react';
import { Link } from 'react-router-dom';

import { truncateText } from '../helpers/index';
import { avgReview } from '../helpers/index';

const PhotoItem = (props) => {

    const { _id, file, name, description, reviews } = props.photo;

    return (
        <div className="row photo-row">
            <div className="col-md-2">
                <Link to={`/review/${_id}`}><img className="img-thumbnail" src={file} /></Link>
            </div>
            <div className="col-md-6">
                <h4>{name}</h4>
                
                {props.photo.reviews ?
                    (<p>Average Rating:
                        {props.avgReview(reviews)}
                        <img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                        ({reviews.length})
                    </p>)
                        : 'No Reviews'
                    }
                
                <p>{truncateText(description, 150)}</p>
                <Link to={`/review/${_id}`} className="btn btn-default">Read Reviews</Link>
                <Link to={`/review/add/${name}/${_id}`} className="btn btn-primary">Add Review</Link>
            </div>
        </div>
    );
}

export default PhotoItem;