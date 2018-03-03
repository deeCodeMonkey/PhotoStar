import React from 'react';
import { moment } from "meteor/momentjs:moment";

//user rating comments
const PhotoReviewItem = (props) => {

    return (

        <div className="row">
            <div className="col-sm-12">
                <hr />
                <div className="review-block">
                    <div className="row">
                        <div className="col-sm-3">
                            <img src="https://www.shareicon.net/download/2015/09/20/104335_avatar.svg" className="img-rounded" />
                            <div className="review-block-name"><a href="#">{props.reviewedBy}</a></div>
                            <div className="review-block-date">Posted: {moment(props.createdAt).format('LL')}</div>
                        </div>

                        <div className="col-sm-9">
                            <span><img className="stars" src={`/img/star${props.rating}.png`} /></span>

                            <div className="review-block-rate">
                                <button type="button" className="btn btn-warning btn-xs" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </button>
                                <button type="button" className="btn btn-warning btn-xs" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </button>
                                <button type="button" className="btn btn-warning btn-xs" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </button>
                                <button type="button" className="btn btn-default btn-grey btn-xs" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </button>
                                <button type="button" className="btn btn-default btn-grey btn-xs" aria-label="Left Align">
                                    <span className="glyphicon glyphicon-star" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div className="review-block-title">this was nice in buy</div>
                            <div className="review-block-description">{props.body}</div>
                        </div>

                    </div>
                    <hr />
                </div>

            </div>
        </div>

    );

}


export default PhotoReviewItem;









   

