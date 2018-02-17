import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { moment } from "meteor/momentjs:moment";

const AddReview = (props) => {

    onSubmit = (e, photoId) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const body = e.target.body.value;
        const reviewCreatedAt = moment(new Date()).format('LL, h:mm:ss a')

        Meteor.call('photos.review.insert', photoId, rating, body, reviewCreatedAt); 
        props.history.push(`/review/${photoId}`);
    }

        return (
            <div>
                <h3>Add A Review For <strong>{props.match.params.photoName}</strong></h3>
                <form className="new-review" onSubmit={(e) => onSubmit(e, props.match.params.photoId)}>
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
                        <input type="submit" name="submit" className="btn btn-success" value="Submit Review" />
                        <Link to={`/review/${props.match.params.photoId}`} className="btn btn-default">Close</Link>
                    </div>

                </form>
               
            </div>
        );
}

export default AddReview;



