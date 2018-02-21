import React, { Component } from 'react';

import PhotoItem from './PhotoItem';
import { clientReport } from '../api/photos';

import { avgReview } from '../helpers/index';
import { fetchClientReport } from '../helpers/index';


export default class Home extends Component {

    state = {
        photos: [],
        avgReview: []
    }

    //componentWillMount() {
    //    Tracker.autorun(() => {
    //        if (Meteor.user()) {
    //            this.props.history.replace('/photos')
    //        }
    //    })
    //}

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
            return this.state.photos.slice(0, 3).map((photo) => {
                return (
                    <p key={photo._id}>
                        Rating count: {photo.ratingsCount}
                        Rating Avg: {photo.averageRating}
                        Image: {photo.image}
                    </p>
                );
            });
    }



    render() {

        return (
            <div>
                <h3>Top Photos</h3>
                <h1>LANDING PAGE</h1>
                <div className="container" >
                    {this.renderPhotos()}

                </div>
            </div>
        );
    }
}

