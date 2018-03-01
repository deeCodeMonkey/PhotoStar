import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
//import { moment } from "meteor/momentjs:moment";

class AddReview extends Component {

    state = {
        errorMessage: null
    }

    componentWillMount() {
        Tracker.autorun(() => {
            if (!Meteor.user()) {
                this.props.history.push('/')
            }
        })
    }

    onSubmit = (e, photoId) => {
        e.preventDefault();

        const reviewedBy = Meteor.user().emails[0].address;
        const rating = parseInt(e.target.rating.value);
        const body = e.target.body.value;
        const reviewCreatedAt = new Date();
            //moment(new Date()).format('LL, h:mm:ss a');

        Meteor.call('photos.review.insert', photoId, rating, body, reviewCreatedAt, reviewedBy, (error, result) => {
            if (error) {
                this.setState({ errorMessage: error.reason });
            } else {
                this.props.history.push(`/review/${photoId}`);
            }
        });
    }


    render() {

        return (
            <div>
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
                        <label>Review</label>
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



