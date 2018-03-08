import React from 'react';
import { moment } from "meteor/momentjs:moment";

//ratings summary
const PhotoReviewRatingBox = (props) => {

    const style = {
        clear: 'both'
    }

    const displayStars = (starsCount) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            let classname = i < starsCount
                ? 'btn-warning'
                : 'btn-default btn-grey';
            stars.push(<button key={i} type="button" className={"btn " + classname + " btn-sm"} aria-label="Left Align" >
                <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
            </button>);
        }
        return stars;
    };




    return (
        <div className="col-sm-12">
            <div className="rating-block">
                <h4>Average user rating</h4>
                <div className="row d-inline-block">
                    <div className="col-sm-7">
                        <h2 className="bold">{props.avgReview(props.reviews)} <small>/ 5</small>
                            &nbsp;&nbsp; <small>({props.reviewsCount}) {
                            props.reviewsCount === 1 ? 'review' : 'reviews'
                        }
                            </small></h2>
                    </div>
                    {/*<div className="col-sm-6"><small>({props.reviewsCount}) {
                                props.reviewsCount === 1 ? 'review' : 'reviews'
                            }</small>
                            </div>*/}
                </div>
                <div className="d-inline-block">
                    {displayStars(Math.round(props.avgReview(props.reviews)))}
                </div>
            </div>
        </div>
    );

}


export default PhotoReviewRatingBox;


