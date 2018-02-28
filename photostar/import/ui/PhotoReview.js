import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ImageGallery from 'react-image-gallery';

import { Photos, reviewsCollection } from '../api/photos';

import { avgReview, fetchClientReport } from '../helpers/index';

import ReviewItem from './ReviewItem';


class PhotoReview extends Component {

    state = {
        reviews: null,
        deleteConfirm: null
    };

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
        //allow time for images to load 
        setTimeout(function () { window.location.reload() }, 1000);
    }

    addTags = async (photoImages, galleryId) => {
        let promises = [];

        for (let i = 0; i < photoImages.length; i++) {
            let url = photoImages[i].original;
            promises.push(
                new Promise((resolve, reject) => {
                    Meteor.call('googleVisionAPI.label', url, function (err, res) {
                        if (err) {
                            console.log('===Google API error', err);
                        }
                        resolve(res.responses[0].labelAnnotations);
                    });
                })
            )
        }

        Promise.all(promises)
            .then((results) => {

                let tags = [];
                for (i = 0; i < results.length; i++) {
                    results[i].map((label) => {
                        tags.push(label.description);
                    });
                }
                //remove duplicate tags in array
                let uniqTags = Array.from(new Set(tags))
                //limit number of tags to 25
                let finalTags = uniqTags.slice(0, 25);
                Meteor.call('googleVisionAPI.insertLabels', finalTags, galleryId);
            });
    }


    render() {
        //console.log('=======PROPS=========', this.props);
        if (!this.props.photoProfile || !this.state.reviews) return null;
        const { _id, photoImages, name, description, reviews, category, userId, userEmail, tags } = this.props.photoProfile;

        renderNotation = () => {
            if (!Meteor.userId()) {
                return <p>Log in to rate this photo, or submit your own photo!</p>;
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
                    <div className="col-md-8">
                        {this.renderImages(photoImages)}
                    </div>

                    <div className="col-md-4">
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
                            <Link to={`/review/add/${name}/${_id}`} className="btn btn-review ">Leave A Review</Link>
                            : ''
                        }

                        {renderNotation()}

                        <button onClick={() => { this.props.history.goBack() }}>Go Back</button>
                       
                        {(Meteor.userId() && Meteor.userId() === userId && !this.state.deleteConfirm) ?
                            <button type="button" className="btn btn-inactive" onClick={this.deletePhoto}>Delete</button>
                            : ''
                        }
                        {this.state.deleteConfirm}

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

                {(Meteor.userId() && Meteor.userId() === userId) ?
                    <div className="row">

                        <button onClick={() => { this.addTags(photoImages, _id) }}>Add Photo Tags</button>
                        Display tags:
                     {tags ?
                            tags.map((tag, index) => {
                                return (
                                    <h4 key={index}>{tag}===</h4>
                                );
                            })
                            : ''
                        }
                    </div>
                    : ''}


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

