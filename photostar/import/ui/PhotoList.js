﻿import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';

export default class PhotoList extends Component {

    state = {
        photos: [],
        category: 'All',
        keywords: ''
    }

    filterPhotos = (category) => {
        const photos = category !== 'All' ?
            Photos.find({ category }).fetch()
            : Photos.find({}, { sort: { createdAt: -1 } }).fetch();
        //clear keywords search when change category
        this.setState({ photos, category, keywords: '' });
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

    //controlled input value by react state. input will clear when category selection changes
    handleKeywordsChange = (e) => {
        this.setState({ keywords: e.target.value });
    }

    //return photos from a keywords search, filter by category if applicable
    searchTags = async (e) => {
        e.preventDefault();
        let keywords = this.state.keywords;
        if (keywords) {
            keywords = keywords.toLowerCase();
            let searchKeywords = keywords.split(/[ ,]+/);

            let arrayTags = [];
            for (let keyword of searchKeywords) {
                arrayTags.push({ tags: keyword });
            }

            if (this.state.category && this.state.category !== 'All') {
                const searchPhotos = await Photos.find({
                    $and: [
                        { category: this.state.category },
                        { $or: arrayTags }
                    ]
                }).fetch();
                this.setState({ photos: searchPhotos });
            } else {
                const searchPhotos = await Photos.find({
                    $and: [
                        { $or: arrayTags }
                    ]
                }).fetch();
                this.setState({ photos: searchPhotos });
            }
        }
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

                <div>
                    <form onSubmit={this.searchTags}>
                        <div className="form-group col s4">
                            <input value={this.state.keywords} onChange={this.handleKeywordsChange} type="text" className="form-control" id="keywords" placeholder="keywords" />
                        </div>
                        <button>Search</button>
                    </form>
                    <button onClick={() => { this.filterPhotos(this.state.category) }}>Clear</button>
                </div>

                <h3>{this.state.category} Photos</h3>
                <div className="container" >
                    {this.renderPhotos()}
                </div>
            </div>
        );
    }
}