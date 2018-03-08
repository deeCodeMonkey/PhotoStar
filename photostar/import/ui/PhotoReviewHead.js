import React from 'react';
import { Link } from 'react-router-dom';

import { avgReview } from '../helpers/index';

import PhotoReviewRatingBox from './PhotoReviewRatingBox';
import PhotoReviewDeleteModal from './PhotoReviewDeleteModal';

const PhotoReviewHead = (props) => {

    return (
        <div className="row">
            <div className="col-md-1">
            </div>
            <div className="col-md-10">

                <div className="row">
                    <div className="col-md-7">
                        <h2>{props.title}</h2>

                        <div className="row">
                            <div className="col-md-12">
                                <h4>Category: {props.category}</h4>
                                <h4>Submitted By: {props.userEmail}</h4>
                                <h5 className="marg-t font-italic">{props.renderNotation(props.loggedIn, props.isCurrentUser, props.userId, props.displayReviewButton)}</h5>

                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                        <button className="btn_charcoal" onClick={props.goBack}>Back</button>
                                    </div>
                                    {
                                        (props.isCurrentUser(props.loggedIn, props.userId) && props.loggedIn) ?
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                                <button className="btn_clear" onClick={props.modalOpen}>Delete</button>
                                            </div>
                                            : ''
                                    }

                                    <PhotoReviewDeleteModal modalStatus={props.modalStatus} modalClose={props.modalClose} deleteGallery={props.deleteGallery} />

                                    {(!props.isCurrentUser(props.loggedIn, props.userId) && props.loggedIn && props.displayReviewButton()) ?
                                        (<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <Link to={`/review/add/${props.title}/${props._id}`} className="btn_teal">Leave A Review</Link>
                                        </div>)
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-5 marg-t">
                        <div className="row">
                            {props.reviews ?
                                < PhotoReviewRatingBox avgReview={avgReview} reviewsCount={props.reviews.length} reviews={props.reviews} />
                                : <h4> No reviews. </h4>}
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-md-1">
            </div>
        </div>
    );

}


export default PhotoReviewHead;
