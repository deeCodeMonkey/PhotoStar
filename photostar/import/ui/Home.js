import React, { Component } from 'react';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';

export default class Home extends Component {

    state = {
        topPhotos: []
    }

    getTopPhotos = (photos) => {
        //get photos and number of ratings
        //get photo avg rating
        //sort by highest avg, then number of ratings
        //setState photos to obtain top 3 in descending order
 
        Photos.find({}).fetch();

        this.setState({ topPhotos });
    }

    renderPhotos = () => {
        return this.state.topPhotos.map((photo) => {
            return (
                <PhotoItem key={photo._id} photo={photo} avgReview={avgReview} />
            );
        })
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

//import React from 'react';

////presentational component with no props
//const Home = () => {

//    return (
//        <div>
//            HOME component- Top 3 photos
//        </div>
//    );
//}

//export default Home;