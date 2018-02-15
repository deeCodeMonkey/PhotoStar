import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';

export default class PhotoList extends Component {

    state = {
        photos: [],
        category: ''
    }

    filterPhotos = (category) => {
        const photos = category ?
            Photos.find({ category }).fetch()
            : Photos.find().fetch();

        this.setState({ photos, category });
    }

    componentDidMount() {
        //access updated list of categories
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
            //filter by category
            this.filterPhotos(this.props.match.params.category);
        });
    }

    componentWillReceiveProps(nextProps) {
        //to navigate between categories
        this.filterPhotos(nextProps.match.params.category);
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
                <h3>{this.state.category} Photos</h3>
                <div className="container" >
                    {this.renderPhotos()}
                </div>
            </div>
        );
    }
}