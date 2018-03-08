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
        return this.state.photos.slice(0, 3).map((photo, index) => {
            return (
                <div className="col-sm-6 col-md-4" key={photo._id}>
                    <Link to={`/review/${photo._id}`}>
                        <div className="thumbnail small-padding-bg">
                            <img src={photo.image[0].original} alt="top photos" />
                            <div className="caption">

                                <h4 className="text-center"><strong>{photo.title}</strong></h4>
                                <div className="or-spacer">
                                    <div className="mask"></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="image-size-trophy text-center">
                                            <img src={`/place${index}.png`} alt="trophy" />
                                        </div>
                                    </div>
                                    <div className="col-md-7 text-center">
                                        <h5>Average Rating: {Math.round(photo.averageRating * 10) / 10}</h5>
                                        <h5>From {photo.ratingsCount} rating(s)</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        });
    }

    render() {
        //console.log('HOME=======', this.state.photos);

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





