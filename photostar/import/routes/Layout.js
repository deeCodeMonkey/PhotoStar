import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

import Navbar from '../ui/partials/Navbar';
import Sidebar from '../ui/partials/Sidebar';
import Footer from '../ui/partials/Footer';
import Home from '../ui/Home';
import PhotoList from '../ui/PhotoList';
import AddPhoto from '../ui/AddPhoto';
import AddReview from '../ui/AddReview';
import PhotoReview from '../ui/PhotoReview';
import MyPhotos from '../ui/MyPhotos';

//<Redirect from="/photos/add" to="/photos" />

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
                                <Route path="/review/add/:photoName/:photoId" component={AddReview} />
                                <Route path="/review/:photoId" component={PhotoReview} />

                                <Route path="/categories/:category" component={PhotoList} />

                                <Route path="/photos/:userId/add" component={AddPhoto} />
                                <Route path="/photos/:userId" component={MyPhotos} />
                                <Route path="/photos" component={PhotoList} />

                                <Route exact path="/" component={Home} />
                           </Switch>
                        </div>
                        </div>
                    </div>
                </div>
        </BrowserRouter>

            <Footer />

    </div>
        );