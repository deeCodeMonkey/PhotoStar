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

        return (
            <div className="container">

                {/*MODAL*/}
                <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>

                <div class="modal fade-scale" id="myModal" role="dialog">
                    <div class="modal-dialog">


                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Modal Header</h4>
                            </div>
                            <div class="modal-body">
                                <p>Some text in the modal.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
                {/*MODAL*/}




                <div className="row">
                    <div className="col-md-12">
                        <legend><center>Add Photo Gallery And Info</center></legend>
                        <form onSubmit={this.onSubmit} className="form-horizontal">
                            <fieldset>
                                <div className="col-md-12">

                                    <div className="col-md-8">
                                        {this.state.errorMessage ?
                                            <p className="alert alert-danger">{this.state.errorMessage}</p>
                                            : ''
                                        }

                                        <div className="form-group">
                                            <label className="col-md-3 control-label">Title</label>
                                            <div className="col-md-9">
                                                <input id="title" name="title" placeholder="Title" className="form-control input-md" required="" type="text" />

                                            </div>
                                        </div>
                                        {/*<!-- Select Basic -->*/}
                                        <div className="form-group">
                                            <label className="col-md-3 control-label">Category</label>
                                            <div className="col-md-9">
                                                <select id="category" name="category" className="form-control">
                                                    <option value="0">Select Category</option>
                                                    {this.renderCategories()}

                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="col-md-3 control-label">Photos (Up to 6)</label>
                                            <div className="col-md-9">
                                                <div class="update-nag">
                                                    <input type="file" name="image" id="image" multiple class="hide" />
                                                    <label htmlFor="image" class="update-split update-info"><i class="glyphicon glyphicon-folder-open"></i></label>
                                                </div>
                                            </div>
                                        </div>

                                        {/*<!-- Textarea -->*/}
                                        <div className="form-group">
                                            <label className="col-md-3 control-label">Discription</label>
                                            <div className="col-md-9">
                                                <textarea className="form-control" id="description" name="description"></textarea>
                                            </div>
                                        </div>

                                        {/*<!-- Button -->*/}
                                        <div className="form-group">
                                            <label className="col-md-3 control-label"></label><center>
                                                <div className="col-md-4">
                                                    <Link to="/categories/all" className="btn_orange medium customs-margin">Cancel</Link>
                                                </div>
                                                <div className="col-md-5">
                                                    <button id="submit" name="submit" className="btn_orange medium customs-margin">Submit</button>
                                                </div>
                                            </center>
                                        </div>

                                        <div>
                                            {this.state.loading ?
                                                <div className="loading">Loading&#8230;</div>
                                                : ''}
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPhoto;



//<div className="container">
//    <div className="row">
//        <div className="col-md-12">
//            <legend><center>Add Photo Gallery And Info</center></legend>
//            <form onSubmit={this.onSubmit} className="form-horizontal">
//                <fieldset>
//                    <div className="col-md-12">

//                        <div className="col-md-8">
//                            {this.state.errorMessage ?
//                                <p className="alert alert-danger">{this.state.errorMessage}</p>
//                                : ''
//                            }

//                            <div className="form-group">
//                                <label className="col-md-3 control-label">Title</label>
//                                <div className="col-md-9">
//                                    <input id="title" name="title" placeholder="Title" className="form-control input-md" required="" type="text" />

//                                </div>
//                            </div>
//                            {/*<!-- Select Basic -->*/}
//                            <div className="form-group">
//                                <label className="col-md-3 control-label">Category</label>
//                                <div className="col-md-9">
//                                    <select id="category" name="category" className="form-control">
//                                        <option value="0">Select Category</option>
//                                        {this.renderCategories()}

//                                    </select>
//                                </div>
//                            </div>

//                            <div className="form-group">
//                                <label className="col-md-3 control-label">Photos (Up to 6)</label>
//                                <div className="col-md-9">
//                                    <div class="update-nag">
//                                        <input type="file" name="image" id="image" multiple class="hide" />
//                                        <label htmlFor="image" class="update-split update-info"><i class="glyphicon glyphicon-folder-open"></i></label>
//                                    </div>
//                                </div>
//                            </div>

//                            {/*<!-- Textarea -->*/}
//                            <div className="form-group">
//                                <label className="col-md-3 control-label">Discription</label>
//                                <div className="col-md-9">
//                                    <textarea className="form-control" id="description" name="description"></textarea>
//                                </div>
//                            </div>

//                            {/*<!-- Button -->*/}
//                            <div className="form-group">
//                                <label className="col-md-3 control-label"></label><center>
//                                    <div className="col-md-4">
//                                        <Link to="/categories/all" className="btn_orange medium customs-margin">Cancel</Link>
//                                    </div>
//                                    <div className="col-md-5">
//                                        <button id="submit" name="submit" className="btn_orange medium customs-margin">Submit</button>
//                                    </div>
//                                </center>
//                            </div>

//                            <div>
//                                {this.state.loading ?
//                                    <div className="loading">Loading&#8230;</div>
//                                    : ''}
//                            </div>
//                        </div>
//                    </div>
//                </fieldset>
//            </form>
//        </div>
//    </div>
//</div>


