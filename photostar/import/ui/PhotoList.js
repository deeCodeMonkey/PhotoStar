import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Photos } from '../api/photos';

import PhotoItem from './PhotoItem';
import SideBar from './partials/Sidebar';

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
        console.log('keywords', keywords);
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
                <div className="row" key={photo._id}>
                    <PhotoItem photo={photo} />
                    <br/>
                </div>
            );
        })
    }

    render() {

        return (
            <div>
                <div className="or-spacer">
                    <div className="mask"></div>
                    <span><i>{this.state.category} Photos</i></span>
                </div>
                <br />
                <div className="row">         
                    <div className="col-md-10 marg-l">
                        <div id="custom-search-input">
                            <form className="input-group" onSubmit={this.searchTags}>
                                <input type="text" className="search-query form-control" placeholder="Search By Tag Keywords" value={this.state.keywords} onChange={this.handleKeywordsChange} />
                                <span className="input-group-btn">
                                    <button className="btn btn-danger" type="button" onClick={() => { this.filterPhotos(this.state.category) }}>
                                        <span className=" glyphicon glyphicon-search"></span>
                                    </button>
                                </span>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-1 marg-t">
                        <button className="btn_clear" onClick={() => this.filterPhotos(this.state.category)}>Clear</button>
                    </div>
                </div>
                
                <br />
                <div className="row">
                    <div className="col-md-12">
                        {this.renderPhotos()}
                </div>
                </div>
            </div>
        );
    }
}


