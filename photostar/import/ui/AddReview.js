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
                {this.state.photo ?
                    <div>
                        <PhotoItem photo={this.state.photo} />
                    </div> : ''}

                <h3>Add A Review For <strong>{this.props.match.params.photoTitle}</strong></h3>

                {this.state.errorMessage ?
                    <p className="text-danger bg-danger">{this.state.errorMessage}</p>
                    : ''
                }

                <form className="new-review" onSubmit={(e) => this.onSubmit(e, this.props.match.params.photoId)}>
                    <div className="form-group">
                        <label>Star Rating</label>
                        <select className="form-control" name="rating">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Review Heading</label>
                        <input className="form-control" name="heading" />
                    </div>
                    <div className="form-group">
                        <label>Comments</label>
                        <textarea className="form-control" name="body"></textarea>
                    </div>

                    <div>
                        <input type="submit" name="submit" className="btn btn-review" value="Submit Review" />
                        <Link to={`/review/${this.props.match.params.photoId}`} className="btn btn-review-cancel">Cancel</Link>
                    </div>

                </form>

            </div>
        );
    }
}

export default AddReview;



//https://bootsnipp.com/snippets/featured/bootstrap-300-contact-form