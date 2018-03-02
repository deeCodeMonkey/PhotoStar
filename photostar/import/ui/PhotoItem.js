import React from 'react';
import { Link } from 'react-router-dom';
import { moment } from "meteor/momentjs:moment";

import { truncateText } from '../helpers/index';
import { avgReview } from '../helpers/index';

const PhotoItem = (props) => {

    const { _id, photoImages, title, description, reviews, userId, userEmail, createdAt } = props.photo;

    return (
        <div className="container">
            <div className="well">
                <div className="row">
                    <div className="media">
                        <div className="col-md-3">
                            <Link to={`/review/${_id}`} className="pull-left">
                                <img className="img media-object" src={photoImages[0].original} />
                            </Link>
                        </div>
                        <div className="col-md-9">
                            <div className="media-body">
                                <h4 className="media-heading font-weight-bold text-capitalize">{title}</h4>
                                <p className="text-right">By {userEmail}</p>
                                <p className="text-justify">{truncateText(description, 150)}</p>
                                <ul className="list-inline list-unstyled">
                                    <li><span><i className="glyphicon glyphicon-calendar"></i> {moment(createdAt).format('LL, h:mm:ss a')} </span></li>
                                    <li>|</li>
                                    <li>
                                        <span className="glyphicon glyphicon-star"></span>
                                    </li>
                                    <li>|</li>
                                    <li>
                                        {props.photo.reviews ?
                                            (<p>Average Rating:
                                                <img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                                <span>({reviews.length})</span>
                                            </p>)
                                            : <p>No Ratings.</p>
                                        }
                                    </li>
                                </ul>

                                <div>
                                    <Link to={`/review/${_id}`} className="btn btn-default btn-review">Read Reviews</Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoItem;

