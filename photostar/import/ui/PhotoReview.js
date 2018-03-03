import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Photos, reviewsCollection } from '../api/photos';

import { avgReview, fetchClientReport } from '../helpers/index';

import PhotoReviewItem from './PhotoReviewItem';
import PhotoReviewTags from './PhotoReviewTags';
import PhotoReviewDeleteModal from './PhotoReviewDeleteModal';
import PhotoReviewRatingBox from './PhotoReviewRatingBox';


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
                return true;
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
            return <p>Log in to rate this photo, or submit your own photo!</p>;
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
        const style = {
            backgroundColor: 'red'
        }

        //ensure data from both are available before rendering
        if (!this.props.photoProfile || !this.state.reviews) return null;

        const { _id, photoImages, title, description, reviews, category, userId, userEmail, tags } = this.props.photoProfile;

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
                <div className="container style_30">
                    <div className="profile-head">
                        <div className="col-md-5 col-sm-5 col-xs-5">
                            <h5>{title}</h5>
                            <p>{category}</p>
                            {reviews ?
                                <p>
                                    Average Rating:<img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
                                    ({reviews.length})
                                    </p> : <p> No reviews. </p>}
                            <ul>
                                <li><span className="glyphicon glyphicon-briefcase"></span>Submitted By: {userEmail}</li>
                                <li><span className="glyphicon glyphicon-map-marker"></span> stuff===========</li>
                            </ul>
                            {this.renderNotation(this.state.loggedIn, this.isCurrentUser, userId, this.displayReviewButton)}

                            {(!this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn && this.displayReviewButton()) ?
                                <Link to={`/review/add/${title}/${_id}`} className="btn btn-review ">Leave A Review</Link>
                                : ''
                            }



                            <button onClick={() => this.props.history.goBack()}>Back</button>


                            {
                                (this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn) ?
                                    <button type="button" className="btn btn-inactive" onClick={this.modalOpen}>Delete</button>
                                    : ''
                            }
                            <PhotoReviewDeleteModal modalStatus={this.state.modalStatus} modalClose={this.modalClose} deleteGallery={this.deleteGallery} />


                        </div>

                        <div className="col-md-5 col-sm-5 col-xs-5">
                            < PhotoReviewRatingBox />
                        </div>
                    </div>
                </div>

                <br />
                <br />


                {/*Description and Tags*/}
                <div className="container">
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="menu_title">
                                <b>Description</b>
                                <p className="text-justify">{description}</p>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div>
                                            <label>Tags:</label>
                                            
                                            <div>
                                                <PhotoReviewTags tags={tags} userId={userId} photoImages={photoImages} photoId={_id} isCurrentUser={this.isCurrentUser} loggedIn={this.state.loggedIn} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/*Reviews List*/}
                    <div className="col-sm-8">
                        <div data-spy="scroll" className="tabbable-panel">
                            <div className="tabbable-line">
                                <div className="tab-content">

                                    <h4>Reviews & Ratings</h4>

                                </div>

                                {this.state.reviews ?
                                    this.state.reviews.map((review, index) => {
                                        return (
                                            <PhotoReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt} reviewedBy={review.reviewedBy} />
                                        );
                                    })
                                    : <p className="marg-l">There are no ratings.</p>
                                }

                            </div>
                        </div>
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



//https://bootsnipp.com/snippets/M0NlA
















//========================================================================================================================
  //<div className="container marg-t">
    //    <div className="row product-row">
    //        <div className="col-md-8">
    //            {this.renderImages(photoImages)}
    //        </div>

    //        <div className="col-md-4">
    //            <h3 className="text-capitalize">{title}</h3>
    //            <p>Category: {category}</p>
    //            <p>Submitted by: {userEmail}</p>
    //            {reviews ?
    //                <p>
    //                    Average Rating:<img className="stars" src={`/img/star${avgReview(reviews)}.png`} />
    //                    ({reviews.length})
    //                    </p> : <p> No reviews. </p>
    //            }

    //            {(!this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn && this.displayReviewButton()) ?
    //                <Link to={`/review/add/${title}/${_id}`} className="btn btn-review ">Leave A Review</Link>
    //                : ''
    //            }

    //            {this.renderNotation(this.state.loggedIn, this.isCurrentUser, userId, this.displayReviewButton)}

    //            <button onClick={() => this.props.history.goBack()}>Back</button>


    //            {
    //                (this.isCurrentUser(this.state.loggedIn, userId) && this.state.loggedIn) ?
    //                    <button type="button" className="btn btn-inactive" onClick={this.modalOpen}>Delete</button>
    //                    : ''
    //            }
    //            <PhotoReviewDeleteModal modalStatus={this.state.modalStatus} modalClose={this.modalClose} deleteGallery={this.deleteGallery} />



    //            <div>
    //                <PhotoReviewTags tags={tags} userId={userId} photoImages={photoImages} photoId={_id} isCurrentUser={this.isCurrentUser} loggedIn={this.state.loggedIn} />
    //            </div>

    //        </div>
    //    </div>
    //    <div className="row marg-tt">
    //        <div className="col-md-12">
    //            <p className=" marg">{description}</p>
    //        </div>
    //    </div>

    //    <hr />

    //    <div className="row">
    //        <h4 className="marg-l">Reviews & Ratings</h4>
    //        <hr />
    //        {this.state.reviews ?
    //            this.state.reviews.map((review, index) => {
    //                return (
    //                    <PhotoReviewItem key={index} rating={review.rating} body={review.body} createdAt={review.reviewCreatedAt} reviewedBy={review.reviewedBy} />
    //                );
    //            })
    //            : <p className="marg-l">There are no ratings.</p>
    //        }
    //    </div>

    //</div>








