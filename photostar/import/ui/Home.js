import React, { Component } from 'react';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';
import { avgReview } from '../helpers/index';

export default class Home extends Component {

    state = {
        photos: [],
        avgReview: []
    }

    componentWillMount() {
        Tracker.autorun(() => {
            if (Meteor.user()) {
                this.props.history.replace('/photos')
            }
        })
    }

    componentDidMount() {
        //update for any changes
        Tracker.autorun(() => {
            //subscribe to possibly filtered collection
            Meteor.subscribe('allPhotos');
            //access collection with subscribe conditions
            const results = Photos.find({}, { sort: { createdAt: -1 } }).fetch();
            this.setState({ photos: results });
        });
    }

    renderPhotos = () => {      
        return this.state.photos.map((photo) => {
            return (
                <PhotoItem key={photo._id} photo={photo} />
            );
        })
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

