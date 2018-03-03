import React from 'react';
import { moment } from "meteor/momentjs:moment";

//user ratings
const PhotoReviewItem = (props) => {

    return (
        <div className="tab-pane active" id="tab_default_1">

            <div className="well-sm">
                <h4>Heading</h4>
                <span><img className="stars" src={`/img/star${props.rating}.png`} /></span>
            </div>

            <p align="right">
                <button type="button" className="btn btn-default btn-sm">
                    <span className="glyphicon glyphicon-edit"></span> Edit
                                        </button>
            </p>


            <table className="table bio-table">
                <tbody>
                    <tr>
                        <td>Review By:</td>
                        <td>{props.reviewedBy}</td>
                    </tr>
                    <tr>
                        <td>Review Date:</td>
                        <td>{moment(props.createdAt).format('LL')}</td>
                    </tr>
                </tbody>
                <div><p>{props.body}</p></div>
            </table>
        </div>
    );

}


export default PhotoReviewItem;



