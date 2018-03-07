import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
//import { moment } from "meteor/momentjs:moment";

import PhotoItem from './PhotoItem';

import { Photos } from '../api/photos';

class AddReview extends Component {

    state = {
        errorMessage: null,
        photo: null
    }

    componentWillMount() {
        //component will not render if user not logged in
        Tracker.autorun(() => {
            if (!Meteor.user()) {
                this.props.history.push('/')
            }
        })
    }

    componentDidMount() {
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
            const photo = Photos.find({ _id: this.props.match.params.photoId }).fetch();
            this.setState({ photo: photo[0] });
        });
    }

    onSubmit = (e, photoId) => {
        e.preventDefault();

        const reviewedBy = Meteor.user().emails[0].address;
        const rating = parseInt(e.target.rating.value);
        const heading = e.target.heading.value;
        const body = e.target.body.value;
        const reviewCreatedAt = new Date();

        Meteor.call('photos.review.insert', photoId, rating, body, heading, reviewCreatedAt, reviewedBy, (error, result) => {
            if (error) {
                this.setState({ errorMessage: error.reason });
            } else {
                this.props.history.replace(`/review/${photoId}`);
            }
        });
    }


    render() {

        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="or-spacer">
                            <div className="mask"></div>
                            <span><i>Leave A Review</i></span>
                        </div>
                        {/*<h3>Add A Review For "<strong>{this.props.match.params.photoTitle}</strong>"</h3>*/}
                    </div>
                </div>
                {this.state.photo ?
                    <div>
                        <PhotoItem photo={this.state.photo} />
                    </div> : ''}


                {this.state.errorMessage ?
                    <p className="alert alert-danger">{this.state.errorMessage}</p>
                    : ''
                }
                    <div className="row">

                        <div className="row">
                            <div className="col-xs-1 col-md-1"></div>
                            <div className="col-sm-10 review-form">
                                <form id="contact" method="post" className="form" role="form"
                                    onSubmit={(e) => this.onSubmit(e, this.props.match.params.photoId)}>
                                    <div className="row">
                                        <h4 className="col-md-2">Star Rating</h4>
                                        <div className="col-xs-2 col-md-2 form-group">
                                            <select className="form-control" name="rating">
                                                <option value="0">Select</option>
                                                <option value="1">1 Star</option>
                                                <option value="2">2 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="5">5 Stars</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/*Text Inputs*/}
                                    <div className="row">
                                        <h4 className="col-md-2 control-label">Review Heading</h4>
                                        <div className="col-xs-9 col-md-9 form-group">
                                            <input className="form-control" id="heading" name="heading" placeholder="Heading" type="text" required autoFocus />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h4 className="col-md-2 control-label">Comments</h4>
                                        <div className="col-xs-9 col-md-9"> <textarea className="form-control" id="body" name="body" placeholder="Review Comments" rows="5"></textarea>
                                        </div>
                                    </div>
                                    <br />

                                    {/*Buttons*/}
                                    <div className="row">
                                        <div className="col-xs-8 col-md-8 form-group">
                                        </div>
                                        <div className="col-xs-1 col-md-1 form-group">
                                            <Link to={`/review/${this.props.match.params.photoId}`} className="btn btn-review-cancel">Cancel</Link>
                                        </div>
                                        <div className="col-xs-2 col-md-2 form-group">
                                            <input type="submit" name="submit" className="btn btn-review pull-right" value="Submit Review" />
                                        </div>
                                        <div className="col-xs-1 col-md-1"></div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-xs-1 col-md-1"></div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default AddReview;



