import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Categories } from '../api/categories';

export default class Sidebar extends Component {

    state = {
        categories: []
    }

    componentDidMount() {
        //access updated list of categories
        Tracker.autorun(() => {
            Meteor.subscribe('allCategories');
            const categories = Categories.find().fetch();
            this.setState({ categories });
        });
    }

    renderCategories = () => {
        return this.state.categories.map((category) => {
            return (    
                <Link to={`/categories/${category.name}`} className="list-group-item" key={category.name}>{category.name}</Link>
            );
        })
    }

    render() {

        return (
            <div>
                <h3>Categories</h3>
                <div className="list-group" >
                    {this.renderCategories()}
                </div>
            </div>
        );
    }
}


//export default createContainer(() => {

//    Meteor.subscribe('allCategories');
//    return {
//        //categories: Categories.find({}, {
//        //    sort: {
//        //        name: 1
//        //    }
//        //}).fetch().map((category) => {
//        //    return {
//        //        ...category
//        //    }
//        //})
//    };
//}, Sidebar);