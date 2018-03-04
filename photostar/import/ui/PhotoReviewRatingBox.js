﻿import React from 'react';
import { moment } from "meteor/momentjs:moment";

const star5 = {
    width: '80 %'
};

const star4 = {
    width: '60 %'
};

const star3 = {
    width: '40 %'
};

const star2 = {
    width: '20 %'
};

const star1 = {
    width: '15 %'
};


//ratings summary
const PhotoReviewRatingBox = (props) => {

    return (
        <div className="container">
 
                <p>
                    Average Rating:<img className="stars" src={`/img/star${props.avgReview(props.reviews)}.png`} />
                    ({props.reviewsCount})
                                    </p> 
          

            <div className="row">
                <div className="col-sm-3">
                    <div className="rating-block">
                        <h4>Average user rating</h4>
                        <h2 className="bold padding-bottom-7">4.3 <small>/ 5</small></h2>
                        <button type="button" className="btn btn-warning btn-sm" aria-label="Left Align">
                            <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-warning btn-sm" aria-label="Left Align">
                            <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-warning btn-sm" aria-label="Left Align">
                            <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default btn-grey btn-sm" aria-label="Left Align">
                            <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default btn-grey btn-sm" aria-label="Left Align">
                            <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

}


export default PhotoReviewRatingBox;

