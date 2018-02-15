import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from '../ui/Home';
import Navbar from '../ui/Navbar';
import Sidebar from '../ui/Sidebar';
import Footer from '../ui/Footer';
import PhotoList from '../ui/PhotoList';
import AddPhoto from '../ui/AddPhoto';

export const routes = (
    <div>
        <BrowserRouter>
            <div>
                <Navbar />

                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>

                        <div className="col-md-9">
                            <Switch>          
                                <Route path="/photos/add" component={AddPhoto} />
                                <Route path="/categories/:category" component={PhotoList} />
                                <Route path="/photos" component={PhotoList} />
                                <Route path="/" component={Home} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>

        <Footer />

    </div>
);