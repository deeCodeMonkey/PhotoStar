import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ImageGallery from 'react-image-gallery';

import { Photos, reviewsCollection } from '../api/photos';

import { avgReview, fetchClientReport } from '../helpers/index';

import ReviewItem from './ReviewItem';
import PhotoReviewTags from './PhotoReviewTags';


class PhotoReview extends Component {

    state = {
        reviews: null,
        deleteConfirm: null,
        loggedIn: false
    };

    componentDidMount() {
        this.reviewsTracker = Tracker.autorun(() => {
            //reactive client setup for aggregating in Mongodb
            Meteor.subscribe('reviewsList', this.props.match.params.photoId);
            const results = fetchClientReport(reviewsCollection);
            this.setState({ reviews: results });

            //track logging in and out Meteor state changes
            if (Meteor.userId()) {
                console.log('Logged in photo review');
                this.setState({ loggedIn: true });
            } else {
                console.log('Logged out photo review');
                this.setState({ loggedIn: false });
            }

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

    deletePhoto = () => {
        clickDelete = () => {
            Meteor.call('photos.remove', this.props.match.params.photoId);
            this.props.history.push(`/photos/${Meteor.userId()}`);
        }

        clickCancel = () => {
            this.setState({ deleteConfirm: '' })
        }

        this.setState({
            deleteConfirm:
            <div>
                <p>Are you sure to delete?</p>
                <button type="button" onClick={clickDelete}>Yes</button>
                <button type="button" onClick={clickCancel}>No</button>
            </div>
        });

    }

    renderImages = (photoImages) => {
        return (
            <div>
                <ImageGallery items={photoImages} autoPlay={false} onImageError={this.handleImageErrored} />
            </div>
        );

    }

    handleImageErrored = () => {
        //allow time for images to load and reload IF needed 
        setTimeout(function () { window.location.reload() }, 1000);
    }

    //check if currently logged-in user is same userId of photo gallery presented
    isCurrentUser = (loggedIn, userId) => {
        if (loggedIn && Meteor.userId() === userId) {
            return true;
        }
        return false;
    }

    renderNotation = (loggedIn, isCurrentUser, userId, displayReviewButton) => {
        if (!loggedIn) {
            return <p>Log in to rate this photo, or submit your own photo!</p>;
        }
        else if (isCurrentUser(userId) && loggedIn) {
            return <p>Note: You cannot rate your own photo.</p>
        }
        else if (!displayReviewButton() && loggedIn) {
            return <p>Note: You cannot post more than one review per photo.</p>
        } else {
            return null;
        }
    }



    render() {

        if (!this.props.photoProfile || !this.state.reviews) return null;

        const { _id, photoImages, title, description, reviews, category, userId, userEmail, tags } = this.props.photoProfile;

        console.log('state====', this.state.loggedIn);
        console.log('Is Current User', this.isCurrentUser(userId));

        return (
            <div className="container marg-t">
                <div className="row product-row">
                    <div className="col-md-8">
                        {this.renderImages(photoImages)}
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-capitalize">{title}</h3>
                        <p>Category: {category}</p>
                        <p>Submitted by: {userEmail}</p>
                        {reviews ?
                            <p>
                                Average Rating:<img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                ({reviews.length})
                        </p> : <p> No reviews. </p>
                        }

                        {(!this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn && this.displayReviewButton()) ?
                            <Link to={`/review/add/${title}/${_id}`} className="btn btn-review ">Leave A Review</Link>
                            : ''
                        }

                        {this.renderNotation(this.state.loggedIn, this.isCurrentUser, userId, this.displayReviewButton)}

                        {(this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn && !this.state.deleteConfirm) ?
                            <button type="button" className="btn btn-inactive" onClick={this.deletePhoto}>Delete</button>
                            : ''
                        }
                        {this.state.deleteConfirm}


                        <div>
                            <PhotoReviewTags tags={tags} userId={userId} photoImages={photoImages} photoId={_id} isCurrentUser={this.isCurrentUser} loggedIn={this.state.loggedIn} />
                        </div>

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
        photoProfile: Photos.findOne({ _id: props.match.params.photoId }),
    }
}, PhotoReview);

