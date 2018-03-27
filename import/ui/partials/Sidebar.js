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

    render() {
        const style = {
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '7px',
            paddingLeft: '17px'
        }

        return (
                <div>
                <Link to={'/categories/All'}><div className="btn_charcoal medium cover-size text-center">All Categories</div></Link>
                    <div className="side-bar marg-b">
                        <ul>
                            {this.state.categories.map((category) => {
                                return (
                                    <Link to={`/categories/${category.name}`} key={category.name}><li className="btn_teal medium cover-size text-center" style={style}>{category.name}</li></Link>
                                );
                            })}
                        </ul>
                    </div>
                </div>
        );
    }
}




