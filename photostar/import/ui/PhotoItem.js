import React from 'react';
import { Link } from 'react-router-dom';

import { truncateText } from '../helpers/index';
import { avgReview } from '../helpers/index';

const PhotoItem = (props) => {

    const { _id, photoImages, name, description, reviews, userId } = props.photo;

    return (
        <div className="row photo-row">
            <div className="col-md-2">
                <Link to={`/review/${_id}`}><img className="img-thumbnail" src={photoImages[0].original} /></Link>
            </div>
            <div className="col-md-6">
                <h4 className="font-weight-bold text-capitalize">{name}</h4>

                {props.photo.reviews ?
                    (<p>Average Rating:
                        <img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                        <span>({reviews.length})</span>
                    </p>)
                    : <p>No Ratings.</p>
                }

                <p className="text-justify">{truncateText(description, 150)}</p>

                <Link to={`/review/${_id}`} className="btn btn-default btn-review">Read Reviews</Link>

                {/*
                    (Meteor.userId() && Meteor.userId() !== userId) ?
                    <Link to={`/review/add/${name}/${_id}`} className="btn btn-primary">Add Review</Link>
                    : ''
                */}
            </div>
        </div>
    );
}

export default PhotoItem;

