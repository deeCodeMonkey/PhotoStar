﻿import React from 'react';
import { Link } from 'react-router-dom';
import { moment } from "meteor/momentjs:moment";

import { truncateText } from '../helpers/index';
import { avgReview } from '../helpers/index';

const PhotoItem = (props) => {

    const { _id, photoImages, title, description, reviews, userId, userEmail, createdAt } = props.photo;

    return (
        <div>
            <Link to={`/review/${_id}`}><div className="row small-padding-bg offwhite">
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                    <div className="image-size"><img src={photoImages[0].original} /></div>
                </div>
                
                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 customs-p">
                    <div className="or-spacer marg-t-0">
                        <div className="mask"></div>
                    </div>
                    <p className="font-l">{title}</p>
                    <p>By {userEmail} on {moment(createdAt).format('LL')}</p>
                    {props.photo.reviews ?
                        (<p>Average Rating:
                                                <img className="stars" src={`/img/star${Math.round(avgReview(reviews))}.png`} />
                            <span>({reviews.length})</span>
                        </p>)
                        : <p>No Ratings.</p>
                    }
                    <p>Description: {truncateText(description, 100)}</p>
                   
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <button className="btn_charcoal">Details...</button>
                </div>
            </div>
            </Link>
        </div>
    );
}

export default PhotoItem;


