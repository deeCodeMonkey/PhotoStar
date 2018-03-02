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
                <div className="container-fluid cards-row" key={photo._id}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-4">
                                <div className="thumbnail">
                                <Link to={`/review/${photo._id}`}><img src={photo.image[0].original} alt="top photos" /></Link>
                                <div className="caption">

                                    <h4>Rating count: {photo.ratingsCount}</h4> 
                                    <h4>Rating Avg: {photo.averageRating}</h4>

                                        <p className="card-description"><strong>Bootstrap Thumbnail</strong> Customization Example. Here are customized <strong>bootstrap cards</strong>. We just apply some box shadow and remove border radius.</p>
                                        <p><Link to={`/review/${photo._id}`} className="btn btn-primary" role="button">Button</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        console.log('HOME=======', this.state.photos);

        return (
            <div>
                {this.renderTopPhotos()}
            </div>
        );
    }
}





