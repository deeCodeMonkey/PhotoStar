import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Photos } from '../api/photos';

import ReviewItem from './ReviewItem';

class PhotoReview extends Component {

    state = {
        photoProfile: ''
    }

    componentDidMount() {
        this.setState({ photoProfile: this.props.photoProfile });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ photoProfile: nextProps.photoProfile });
        //console.log('nextProps', nextProps.photoProfile );
    }

    render() {

        if (!this.state.photoProfile) return null

        return (
            <div>
                <h3>{this.state.photoProfile.category}</h3>
                <div className="row product-row">
                    <div className="col-md-6">
                        <img className="profile-photo" src={this.state.photoProfile.file} />
                    </div>
                    <div className="col-md-6">
                        <h4>Title: {this.state.photoProfile.name}</h4>
                        <p>
                            Average Rating: <img className="stars" src="/img/star{{getAvg reviews}}.png" />
                            Number of Reviews:
                        </p>
                        <p>{this.state.photoProfile.description}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right">

                            <a href="/new-review/{{_id}}" className="btn btn-success">Leave A Review</a>

                        </div>
                    </div>
                </div>
                <hr />


                <h4>Reviews & Ratings</h4>

                <ReviewItem />


            </div>
        );
       
    }
}

//inject data to PhotoReview
export default createContainer((props) => {
    Meteor.subscribe('allPhotos');
    return {
        photoProfile: Photos.findOne({ _id: props.match.params.photoId })
    }
}, PhotoReview);

