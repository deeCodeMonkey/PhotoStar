import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Photos } from '../api/photos';

import ReviewItem from './ReviewItem';

const PhotoReview = (props) => {
    console.log(props.photoProfile);
    if (!props.photoProfile) return null

    return (
        <div>
            <h3>{props.photoProfile.category}</h3>
            <div className="row product-row">
                <div className="col-md-6">
                    <img className="profile-photo" src={props.photoProfile.file} />
                </div>
                <div className="col-md-6">
                    <h4>Title: {props.photoProfile.name}</h4>
                    <p>
                        Average Rating: <img className="stars" src="/img/star{{getAvg reviews}}.png" />
                        Number of Reviews:
                        </p>
                    <p>{props.photoProfile.description}</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="text-right">

                        <Link to={`/review/add/${props.photoProfile.category}/${props.photoProfile._id}`} className="btn btn-success">Leave A Review</Link>

                    </div>
                </div>
            </div>
            <hr />

            <h4>Reviews & Ratings</h4>
            {props.photoProfile.reviews ?
                props.photoProfile.reviews.map((review, index) => {
                    return (
                        <ReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt}/>
                    );
                })
                : <p>There are no ratings. Be the first to rate this photo!</p>
            }
        </div>
    );
}

//inject data to PhotoReview
export default createContainer((props) => {
    Meteor.subscribe('allPhotos');
    return {
        photoProfile: Photos.findOne({ _id: props.match.params.photoId})
    }
}, PhotoReview);

