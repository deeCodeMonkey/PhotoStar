import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import { clientReport } from '../api/photos';

import { Photos } from '../api/photos';

import { avgReview, fetchClientReport } from '../helpers/index';

import SideBar from './partials/Sidebar';


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

    renderTopPhotos = () => {
        return this.state.photos.slice(0, 3).map((photo) => {
            return (
                <div className="col-sm-6 col-md-4" key={photo._id}>
                    <Link to={`/review/${photo._id}`}>
                        <div className="thumbnail">
                            <img src={photo.image[0].original} alt="top photos" />
                            <div className="caption">
                                <div className="or-spacer">
                                    <div className="mask"></div>
                                </div>
                                <h4>Rating count: {photo.ratingsCount}</h4>
                                <h4>Rating Avg: {photo.averageRating}</h4>

                                <p className="card-description"><strong>Bootstrap Thumbnail</strong> Customization Example. Here are customized <strong>bootstrap cards</strong>. We just apply some box shadow and remove border radius.</p>

                            </div>
                        </div>
                    </Link>
                </div>
            );
        });
    }

    render() {
        console.log('HOME=======', this.state.photos);

        return (
            <div>
                <div className="flex card-columns">
                    <div className="row">
                        {this.renderTopPhotos()}
                    </div>
                </div>
            </div>
        );
    }
}





