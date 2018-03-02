import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Categories } from '../../api/categories';

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
                <li><Link to={`/categories/${category.name}`} className="list-group-item sidebar" key={category.name}>{category.name}</Link></li>
            );
        })
    }

    render() {

        return (
            <div>
                <div id="navigation">
                  
                        <ul className="top-level">
                        {this.state.categories.map((category) => {
                            return (
                                <li key={category.name}><Link to={`/categories/${category.name}`} className="sidebar" key={category.name}>{category.name}</Link></li>
                            );
                            })}
                        </ul>
                       
                </div>
            </div>
        );
    }
}

 