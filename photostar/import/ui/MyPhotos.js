import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';
import SideBar from './partials/Sidebar';


export default class MyPhotos extends Component {

    state = {
        photos: []
    }

    componentWillMount() {
        //component will not render if user not logged in
        Tracker.autorun(() => {
            if (!Meteor.user()) {
                this.props.history.push('/')
            }
        })
    }

    componentDidMount() {
        Tracker.autorun(() => {
            Meteor.subscribe('allPhotos');
            const results = Photos.find({ 'userId': Meteor.userId() }, { sort: { createdAt: -1 } }).fetch();
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
        const style = {
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '7px'
        }

        return (
            <div>
                <div className="or-spacer">
                    <div className="mask"></div>
                    <span><i>My Photos</i></span>
                </div>
                <br />
             
                {this.state.photos.length ?
                    <div className="col-md-12">
                        {this.renderPhotos()}
                    </div>
                    : (<div className="text-center">You have no photos. Add one now!
                        <br/>
                        <div className="row d-inline-block marg-t">
                            <div className="col-md-4">
                            </div>
                            <div className="col-md-4">
                                <Link to={`/photos/${Meteor.userId()}/add`} style={style}><button className="btn_charcoal medium cover-size text-center">Add Photos</button></Link>
                            </div>
                            <div className="col-md-4">
                            </div>
                        </div>
                    </div>
                    )
                }
            </div>
        );
    }
}


