import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import axios from 'axios';

import { cloudinary_cloud_name, cloudinary_UPLOAD_PRESET } from '../config/keys';

import { Photos } from '../api/photos';
import { Categories } from '../api/categories';

class AddPhoto extends Component {

    state = {
        categories: [],
        errorMessage: null,
        loading: false
    }

    componentWillMount() {
        //component will not render if user not logged in
        Tracker.autorun(() => {
            if (!Meteor.user()) {
                this.props.history.push('/')
            }
        })
    }

    componentDidMount() {
        //access updated list of categories
        Tracker.autorun(() => {
            Meteor.subscribe('allCategories');
            const categories = Categories.find().fetch();
            this.setState({ categories });
        });
        this.setState({ loading: false });
    }

    renderCategories = () => {
        return this.state.categories.map((category) => {
            if (category.name !== 'All') {
                return (
                    <option name="category" value={category.name} key={category.name}>{category.name}</option>
                );
            }
        })
    }

    cloudinaryUpload = async (image) => {
        let cloudinary_URL = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`;

        let photosArrayObj = [];
        for (i = 0; i < image.length; i++) {
            let formData = new FormData();
            formData.append('file', image[i]);
            formData.append('upload_preset', cloudinary_UPLOAD_PRESET);

            await axios.post(cloudinary_URL,
                formData,
            ).then(function (res) {
                photosArrayObj.push({
                    url: res.data.secure_url,
                    public_id: res.data.public_id
                });
                return photosArrayObj;
            }).catch(function (err) {
                console.log('ERROR', err);
            });
        }
        return photosArrayObj;
    }

    cloudinaryImageObject = (photoArrayObj) => {
        let photoObjArray = [];
        for (i = 0; i < photoArrayObj.length; i++) {
            photoObjArray.push({
                original: photoArrayObj[i].url,
                thumbnail: photoArrayObj[i].url,
                public_id: photoArrayObj[i].public_id
            });
        }
        return photoObjArray;
    }

    addPhotos = async (image) => {
        const photoArrayObj = await this.cloudinaryUpload(image);

        const photoObjArray = this.cloudinaryImageObject(photoArrayObj);

        return photoObjArray;
    }

    createGallery = async (title, description, category, userId, userEmail, image) => {
        const imageArray = await this.addPhotos(image);

        Meteor.call('photos.insert',
            title,
            description,
            category,
            imageArray,
            userId,
            userEmail,
            (error, result) => {
                if (error) {
                    this.setState({ errorMessage: error.reason });
                } else {
                    this.props.history.push(`/review/${result}`);
                }
            });
    }


    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ errorMessage: null });

        const userId = Meteor.userId();
        const userEmail = Meteor.user().emails[0].address;

        const title = e.target.title.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const image = e.target.image.files;

        this.setState({ loading: true });

        this.createGallery(title, description, category, userId, userEmail, image);
    }


    render() {
        {
            this.state.errorMessage ?
                this.setState({ loading: false })
                : ''
        }

        return (
            <div>
                <div className="row">
                    <div className="col-sm-1">
                    </div>
                    <div className="col-sm-10">
                        <div className="or-spacer">
                            <div className="mask"></div>
                            <span><i>Add Photos</i></span>
                        </div>
                         <div className="col-sm-1">
                    </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        {this.state.errorMessage ?
                            <p className="alert alert-danger">{this.state.errorMessage}</p>
                            : ''
                        }

                        {this.state.loading ?
                            <div className="loading">Loading&#8230;</div>
                            : ''}

                    </div>
                </div>
                    <div className="row">
                    <div className="col-xs-1 col-md-1"></div>
                    <div className="col-sm-10 review-form">
                        <form id="contact" method="post" className="form" role="form"
                            onSubmit={this.onSubmit}>
                            <div className="row">
                                <h4 className="col-md-2">Category</h4>
                                <div className="col-xs-4 col-md-4 form-group">
                                    <select id="category" name="category" className="form-control">
                                        <option value="0">Select Category</option>
                                        {this.renderCategories()}
                                    </select>
                                </div>
                            </div>

                            {/*File Upload*/}
                            <div className="row">
                                <h4 className="col-md-2 control-label">Photos (Up to 6)</h4>
                                <div className="col-md-1">
                                    <div className="update-nag offwhite">
                                        <i className="glyphicon glyphicon-folder-open"></i><input type="file" name="image" id="image" multiple />
                                        {/*<label htmlFor="image" className="update-split update-info"><i className="glyphicon glyphicon-folder-open"></i></label>*/}
                                    </div>
                                </div>
                                <div className="col-md-9"></div>
                            </div>

                            {/*Text Inputs*/}
                            <div className="row">
                                <h4 className="col-md-2 control-label">Title</h4>
                                <div className="col-xs-9 col-md-9 form-group">
                                    <input className="form-control" id="title" name="title" placeholder="Title" type="text" required autoFocus />
                                </div>
                            </div>
                            <div className="row">
                                <h4 className="col-md-2 control-label">Description</h4>
                                <div className="col-xs-9 col-md-9"> <textarea className="form-control" id="description" name="description" placeholder="Description" rows="5"></textarea>
                                </div>
                            </div>
                            <br />

                            {/*Buttons*/}
                            <div className="row">
                                <div className="col-xs-8 col-md-8 control-label">
                                </div>
                                <div className="col-xs-1 col-md-1">
                                    <Link to="/categories/All" className="btn btn-review-cancel">Cancel</Link>
                                </div>
                                <div className="col-xs-2 col-md-2">
                                    <input type="submit" name="submit" className="btn btn-review" value="Submit Photo(s)" />
                                </div>
                                <div className="col-xs-1 col-md-1"></div>
                            </div>
                        </form>
                    </div>
                    </div>
                    <div className="col-xs-1 col-md-1"></div>
            </div>
        );
    }
}

export default AddPhoto;



