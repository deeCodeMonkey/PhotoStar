import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import PhotoItem from './PhotoItem';
import { clientReport } from '../api/photos';

import { Photos } from '../api/photos';

import { avgReview, fetchClientReport } from '../helpers/index';

export default class Home extends Component {

    state = {
        photos: [],
        avgReview: []
    }

    componentDidMount() {
        //update for any changes
        Tracker.autorun(() => {
            //reactive client setup for aggregating in Mongodb
            Meteor.subscribe('topPhotos');
            const results = fetchClientReport(clientReport);
            this.setState({ photos: results })
        });
    }




    renderPhotos = () => {
        console.log('HOME=======', this.state.photos);
        return this.state.photos.slice(0, 3).map((photo) => {
            return (
                <div key={photo._id}>
                    Rating count: {photo.ratingsCount}
                    Rating Avg: {photo.averageRating}
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <Link to={`/review/${photo._id}`}><img className="profile-photo" src={photo.image[0].original} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {

        return (
            <div>
                <h3>Top 3 Photos</h3>
                <div className="container" >
                    {this.renderPhotos()}

                </div>
               
            </div>
        );
    }
}

