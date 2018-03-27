import { Meteor } from 'meteor/meteor';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navbar from '../ui/partials/Navbar';
import Sidebar from '../ui/partials/Sidebar';
import Footer from '../ui/partials/Footer';
import Home from '../ui/Home';
import PhotoList from '../ui/PhotoList';
import AddPhoto from '../ui/AddPhoto';
import AddReview from '../ui/AddReview';
import PhotoReview from '../ui/PhotoReview';
import MyPhotos from '../ui/MyPhotos';


//destructure to move component down a level. The 'rest' of properties to be available.
const DefaultLayout = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={matchProps => (
            <div>
                <Navbar />
                <div className="container marg-t">
                    <Component {...matchProps} />
                </div>
                <Footer />
            </div>
        )} />
    )
};

const SidebarLayout = ({ component: Component, ...rest }) => {
    return (
        <DefaultLayout {...rest} component={matchProps => (
            <div className="row">
                <div className="col-md-3">
                    <Sidebar />
                </div>
                <div className="col-md-9">
                    <Component {...matchProps} />
                </div>
            </div>
        )} />
    );
};


export const routes = (
    <div>
        <BrowserRouter>
            <div>
                <Switch>

                    <DefaultLayout path="/review/add/:photoTitle/:photoId" component={AddReview} />

                    <DefaultLayout path="/review/:photoId" component={PhotoReview} />

                    <SidebarLayout path="/categories/:category" component={PhotoList} />

                    <DefaultLayout path="/photos/:userId/add" component={AddPhoto} />

                    <SidebarLayout path="/photos/:userId" component={MyPhotos} />

                    <SidebarLayout path="/" component={Home} />

                </Switch>
            </div>
        </BrowserRouter>
    </div>
);


