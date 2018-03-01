import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';

import UserAccounts from '../UserAccounts';

class Navbar extends Component {

    state = {
        loggedIn: null
    }

    //setting to hide certain nav tabs when not logged in
    componentDidMount() {
        Tracker.autorun(() => {
            var userId = Meteor.userId();
            if (!userId) {
                this.setState({ loggedIn: userId });
            } else {
                this.setState({ loggedIn: userId });
            }
        });
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand" to="/">RateMyPet</Link>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">

                                <li><UserAccounts /></li>
                                <li><Link to="/categories/All">All Photos</Link></li>
                            </ul>

                            {this.state.loggedIn ?
                                <ul className="nav navbar-nav"> <li><Link to={`/photos/${Meteor.userId()}`}>My Photos</Link></li>
                                    <li><Link to={`/photos/${Meteor.userId()}/add`} > Add Photo</Link></li>
                                </ul>
                                : ''
                            }

                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;