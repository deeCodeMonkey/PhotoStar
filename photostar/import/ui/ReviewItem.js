import React from 'react';
import { moment } from "meteor/momentjs:moment";

const ReviewItem = (props) => {

    return (
        <div className="container">
            <div className="row marg-tt review-item">
                <div className="col-md-2">
                    <img className="stars" src={`/img/star${props.rating}.png`} />
                    <div className="d-block marg-l marg-t">
                        by {props.reviewedBy} on {moment(props.createdAt).format('LL')}
                    </div>
                </div>

                <div className="col-md-9 marg-l marg-t">
                    "{props.body}"
                    </div>
            </div>
        </div>
    );
}

export default ReviewItem;

