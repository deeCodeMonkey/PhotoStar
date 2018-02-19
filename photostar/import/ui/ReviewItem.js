import React from 'react';

const ReviewItem = (props) => {

    return (
        <div>
            review item component

        <div className="row">
                <div className="col-md-10">
                    <img className="stars" src={`/img/star${props.rating}.png`} />
                </div>
                <div className="col-md-2">
                    {props.rating}
                    {props.body}
                    {props.createdAt}
                </div>
        </div>
        <br />

        </div>
    );
}

export default ReviewItem;