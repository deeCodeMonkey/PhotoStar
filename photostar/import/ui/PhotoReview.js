import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Photos, reviewsCollection } from '../api/photos';

import { fetchClientReport } from '../helpers/index';

import PhotoReviewItem from './PhotoReviewItem';
import PhotoReviewTags from './PhotoReviewTags';
import PhotoReviewHead from './PhotoReviewHead';


class PhotoReview extends Component {

    state = {
        reviews: null,
        loggedIn: false,
        modalStatus: false
    };

    componentDidMount() {
        this.reviewsTracker = Tracker.autorun(() => {
            //data ready for photos.remove
            Meteor.subscribe('allPhotos');
            //reactive client setup for aggregating in Mongodb
            Meteor.subscribe('reviewsList', this.props.match.params.photoId);
            const results = fetchClientReport(reviewsCollection);
            this.setState({ reviews: results });

            //track Meteor logging in-and-out by react state. buttons and messages dependent on user.
            if (Meteor.userId()) {
                this.setState({ loggedIn: true });
            } else {
                this.setState({ loggedIn: false });
            }

        });
    }

    componentWillUnmount() {
        //clean up of data when user navigates from one gallery to another
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
            }
        }
        return true;
    }

    modalOpen = () => {
        this.setState({
            modalStatus: true
        });
    }

    modalClose = () => {
        this.setState({
            modalStatus: false
        });
    }

    deleteGallery = async () => {
        //get public id(s) for cloudinary image delete
        let gallery = await Photos.find({ _id: this.props.match.params.photoId }).fetch();

        let publicIds = [];
        for (let i = 0; i < gallery[0].photoImages.length; i++) {
            publicIds.push(gallery[0].photoImages[i].public_id);
        }
        Meteor.call('photos.remove', this.props.match.params.photoId, publicIds);
        this.props.history.push(`/photos/${Meteor.userId()}`);
    }

    renderImages = (photoImages) => {
        return (
            <div>
                <ImageGallery items={photoImages} autoPlay={false} onImageError={this.handleImageErrored} />
            </div>
        );

    }

    handleImageErrored = () => {
        //allow time for images to load and reload, in case images errored
        setTimeout(function () { window.location.reload() }, 1000);
    }

    //check if currently logged-in user has same userId of photo gallery presented
    isCurrentUser = (loggedIn, userId) => {
        if (loggedIn && Meteor.userId() === userId) {
            return true;
        }
        return false;
    }

    renderNotation = (loggedIn, isCurrentUser, userId, displayReviewButton) => {
        if (!loggedIn) {
            return <p>Log in to rate this photo, or submit your own!</p>;
        }
        else if (isCurrentUser(loggedIn, userId) && loggedIn) {
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

        const { _id, photoImages, title, description, reviews, category, userId, userEmail, tags, createdAt } = this.props.photoProfile;

        return (
            <div>
                {/*photo gallery*/}
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                        </div>
                        <div className="col-md-8">
                            <div>
                                {this.renderImages(photoImages)}
                            </div>
                        </div>
                        <div className="col-md-2">
                        </div>
                    </div>
                </div>


                {/*profile head*/}
                <div className="row">
                    <div className="or-spacer">
                        <div className="mask"></div>
                    </div>
                </div>
                <PhotoReviewHead
                    renderNotation={this.renderNotation}
                    loggedIn={this.state.loggedIn}
                    isCurrentUser={this.isCurrentUser}
                    userId={userId}
                    displayReviewButton={this.displayReviewButton}
                    _id={_id}
                    title={title}
                    category={category}
                    userEmail={userEmail}
                    createdAt={createdAt}
                    modalOpen={this.modalOpen}
                    modalClose={this.modalClose}
                    modalStatus={this.state.modalStatus}
                    deleteGallery={this.deleteGallery}
                    reviews={reviews}
                    goBack={this.props.history.goBack}
                    />
                <hr />
                <br />

                {/*Description and Tags*/}
                <div className="">
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="menu_title">
                                <label>Description</label>
                            </div>
                            <div className="panel-body">
                                <p className="text-justify">{description}</p>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Tags</label>
                                        <hr />
                                        <div>
                                            <PhotoReviewTags tags={tags} userId={userId} photoImages={photoImages} photoId={_id} isCurrentUser={this.isCurrentUser} loggedIn={this.state.loggedIn} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/*Reviews List*/}
                    <div className="col-sm-8">
                        <div>
                            
                            <div className="or-spacer">
                                <div className="mask"></div>
                                <span><i>Reviews & Ratings</i></span>
                            </div>
                        </div>
                        {!this.state.reviews ?
                            '' :
                            this.state.reviews.map((review, index) => {
                                return (
                                    <PhotoReviewItem key={index} rating={review.rating} body={review.body} heading={review.heading} createdAt={review.reviewCreatedAt} reviewedBy={review.reviewedBy} />
                                );
                            })
                        }
                    </div>
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







