import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';

export default class MyPhotos extends Component {

    state = {
        photos: []
    }

    componentWillMount() {
        Tracker.autorun(() => {
            if (!Meteor.user()) {
                this.props.history.push('/')
            }
        })
    }

    componentDidMount() {
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
            const results = Photos.find({'userId': Meteor.userId()}, { sort: { createdAt: -1 } }).fetch();
            this.setState({ photos: results });
            
        });
    }

    renderPhotos = () => {
        return this.state.photos.map((photo) => {
            return (
                <PhotoItem key={photo._id} photo={photo}/>
            );
        })
    }

    render() {
        
        return (
            <div>
                <h3>My Photos</h3>
                {this.state.photos.length ?
                    <div className="container" >
                        {this.renderPhotos()}
                    </div>
                    : 'You have no photos! Add one now!'
                }
                
            </div>
        );
    }
}