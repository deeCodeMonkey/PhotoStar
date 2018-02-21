import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Photos } from '../api/photos';
import { reviewsCollection } from '../api/photos';

import { avgReview } from '../helpers/index';
import { fetchClientReport } from '../helpers/index';

import ReviewItem from './ReviewItem';


class PhotoReview extends Component {

    state = {
        imageStatus: "Loading...",
        reviews: null
    };

    handleImageLoaded = () => {
        this.setState({ imageStatus: "loaded" });
    }

    handleImageErrored = () => {
        this.setState({ imageStatus: "Loading..." });
        window.location.reload();
    }

    componentDidMount() {
        this.reviewsTracker = Tracker.autorun(() => {
            //reactive client setup for aggregating in Mongodb
            Meteor.subscribe('reviewsList', this.props.match.params.photoId);
            const results = fetchClientReport(reviewsCollection);
            this.setState({ reviews: results })
        });
    }

    componentWillUnmount() {
        this.reviewsTracker.stop();
    }

    displayReviewButton = () => {
        if (!Meteor.user()) return true;
        //display if user have not already posted a review
        if (this.state.reviews) {
            for (let i = 0; i < this.state.reviews.length; i++) {
                if (this.state.reviews[i].reviewedBy === Meteor.user().emails[0].address) {
                    return false;
                }
                return true;
            }
        }
        return true;
    }

    render() {

        if (!this.props.photoProfile || !this.state.reviews) return null;
        const { _id, file, name, description, reviews, category, userId, userEmail } = this.props.photoProfile;


        renderNotation = () => {
            if (!Meteor.userId()) {
                return <p>Log in to rate this photo!</p>;
            }
            else if (Meteor.userId() && Meteor.userId() === userId) {
                return <p>Note: You cannot rate your own photo.</p>
            }
            else if (!this.displayReviewButton()) {
                return <p>Note: You cannot post more than one review per photo.</p>
            } else {
                return null;
            }
        }

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
                        <p>Submitted by: {userEmail}</p>
                        {reviews ?
                            <p>
                                Average Rating:<img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                ({reviews.length})
                        </p> : <p> No reviews. </p>
                        }

                        {(Meteor.userId() && Meteor.userId() !== userId && this.displayReviewButton()) ?
                            <Link to={`/review/add/${name}/${_id}`} className="btn btn-primary">Leave A Review</Link>
                            : ''
                        }

                        {renderNotation()}

                        <Link to="/photos">Back</Link>

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
                    {this.state.reviews ?
                        this.state.reviews.map((review, index) => {
                            return (
                                <ReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt} reviewedBy={review.reviewedBy} />
                            );
                        })
                        : <p className="marg-l">There are no ratings.</p>
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

