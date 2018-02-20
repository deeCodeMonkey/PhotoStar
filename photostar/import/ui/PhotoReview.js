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
        const { _id, file, name, description, reviews, category, userId } = this.props.photoProfile;

        return (
            <div className="container marg-t">
                <div className="row product-row">
                    <div className="col-md-6">
                        <img className="profile-photo" src={file} onLoad={this.handleImageLoaded}
                            onError={this.handleImageErrored} />
                        {(this.state.imageStatus === "Loading...") ?
                            <p>{this.state.imageStatus}</p> : ''}
                    </div>

                    <div className="col-md-6">
                        <h3 className="text-capitalize">{name}</h3>
                        <p>Category: {category}</p>
                        {reviews ?
                            <p>
                                Average Rating:<img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                ({reviews.length})
                        </p> : <p> No reviews. </p>
                        }

                        {
                            (Meteor.userId() && Meteor.userId() !== userId) ?
                            <Link to={`/review/add/${category}/${_id}`} className="btn btn-primary">Leave A Review</Link>
                            : ''
                        }


                    </div>
                </div>
                <div className="row marg-tt">
                    <div className="col-md-12">
                        <p className="text-justify marg">{description}</p>
                    </div>
                </div>
                
                <hr />

                <div className="row">
                    <h4 className="marg-l">Reviews & Ratings</h4>
                    <hr />
                    {reviews ?
                        reviews.map((review, index) => {
                            return (
                                <ReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt} reviewedBy={review.reviewedBy} />
                            );
                        })
                        : <p className="marg-l">There are no ratings. Be the first to rate this photo!</p>
                    }
                </div>
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

