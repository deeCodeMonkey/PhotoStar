import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';

export default class PhotoList extends Component {

    state = {
        photos: []
    }

    componentDidMount() {
        //access updated list of categories
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
            const photos = Photos.find().fetch();
            this.setState({ photos });
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
                <h3>Photos</h3>
                <div className="list-group" >
                    {this.renderPhotos()}
                </div>
            </div>
        );
    }
}