import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Photos } from '../api/photos';

import { avgReview } from '../helpers/index';

import ReviewItem from './ReviewItem';


class PhotoReview extends Component {

    state = { imageStatus: "Loading..." };

    handleImageLoaded = () => {
        this.setState({ imageStatus: "loaded" });
    }

    handleImageErrored = () => {
        this.setState({ imageStatus: "Loading..." });
        window.location.reload();
    }


    render() {

        if (!this.props.photoProfile) return null;
        const { _id, file, name, description, reviews, category } = this.props.photoProfile;

        return (
            <div>
                <h3>{category}</h3>
                <div className="row product-row">
                    <div className="col-md-6">
                        <img className="profile-photo" src={file} onLoad={this.handleImageLoaded}
                            onError={this.handleImageErrored} />
                        {(this.state.imageStatus === "Loading...") ?
                            <p>{this.state.imageStatus}</p> : ''}
                    </div>

                    <div className="col-md-6">
                        <h4>Title: {name}</h4>
                        {reviews ?
                            <p>
                                Average Rating: {avgReview(reviews)} <img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                ({reviews.length})
                        </p> : 'No reviews.'
                        }

                        <p>{description}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right">

                            <Link to={`/review/add/${category}/${_id}`} className="btn btn-success">Leave A Review</Link>

                        </div>
                    </div>
                </div>
                <hr />

                <h4>Reviews & Ratings</h4>
                {reviews ?
                    reviews.map((review, index) => {
                        return (
                            <ReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt} />
                        );
                    })
                    : <p>There are no ratings. Be the first to rate this photo!</p>
                }
            </div>
        );
    }
}

//inject data to PhotoReview
export default createContainer((props) => {
    Meteor.subscribe('allPhotos');
    return {
        photoProfile: Photos.findOne({ _id: props.match.params.photoId })
    }
}, PhotoReview);

