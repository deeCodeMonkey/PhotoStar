import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class AddReview extends Component {

    onSubmit = (e, photoId) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const body = e.target.body.value;

        Meteor.call('photos.review.insert', photoId, rating, body); 
        this.props.history.push(`/review/${photoId}`);
    }


    render() {
        console.log('add review', this.props);

        return (
            <div>
                <h3>Add A Review For <strong>{this.props.match.params.photoName}</strong></h3>
                <form className="new-review" onSubmit={(e) => this.onSubmit(e, this.props.match.params.photoId)}>
                    <div className="form-group">
                        <label>Rating</label>
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
                        <input type="submit" name="submit" className="btn btn-success" value="Submit Review" />
                        <a href="/" className="btn btn-default">Close</a>
                    </div>

                </form>
               
            </div>
        );
    }
}

export default AddReview;



