import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:base-package';
import axios from 'axios';

import { cloudinary_cloud_name, cloudinary_UPLOAD_PRESET } from '../config/keys';

import { Photos } from '../api/photos';
import { Categories } from '../api/categories';
import { ImageStore } from '../api/imageStore';

class AddPhoto extends Component {

    state = {
        categories: [],
        errorMessage: null
    }

    componentWillMount() {
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
            return (
                <option name="category" value={category.name} key={category.name}>{category.name}</option>
            );
        })
    }

    cloudinaryUpload = async (e) => {
        e.preventDefault();
        const image = e.target.image.files[0];

        let cloudinary_URL = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`;

        let formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', cloudinary_UPLOAD_PRESET);

        let response = await axios.post(cloudinary_URL,
            formData,
        ).then(function (res) {
            console.log('RESULT=============', res);
        }).catch(function (err) {
            console.log('ERROR===============', err);
        });
        return response;

    }


    onSubmit = (e) => {
        e.preventDefault();

        const userId = Meteor.userId();
        const userEmail = Meteor.user().emails[0].address;

        const name = e.target.name.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const image = e.target.image.files;

        let promises = [];
        //obtain and add CFS image(s) into array for Photo collection insert
        for (i = 0; i < image.length; i++) {
            let fsFile = new FS.File(image[i]);
            promises.push(
                ImageStore.insert(fsFile, function (err, fileObj) {
                    if (err) {
                        reject(console.log(Meteor.Error(err)));
                    }
                    resolve(fileObj);
                })
            );
        }

        Promise.all(promises)
            .then(() => {
                let imageArray = [];
                for (i = 0; i < image.length; i++) {
                    imageArray.push({
                        original: '/cfs/files/ImageStore/' + promises[i]._id,
                        thumbnail: '/cfs/files/ImageStore/' + promises[i]._id
                    });
                }

                Meteor.call('photos.insert',
                    name,
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
            })
            .catch((e) => {
                console.log('PROMISE ERROR', e);
            });

    }


    render() {

        return (
            <div>
                <h3>Add Photo</h3>

                {this.state.errorMessage ?
                    <p className="text-danger bg-danger">{this.state.errorMessage}</p>
                    : ''
                }

                <form onSubmit={this.onSubmit} className="add_product">
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="name" className="form-control" placeholder="Photo Title" />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" name="category">
                            <option value="0">--Select Category--</option>
                            {this.renderCategories()}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Photo</label>
                        <input type="file" name="image" id="image" multiple />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" className="form-control"></textarea>
                    </div>

                    <div>
                        <button className="btn btn-photo" >Add Photo</button>
                        <Link to="/photos" className="btn btn-photo-cancel">Cancel</Link>
                    </div>
                </form>

                <div>
                    <form onSubmit={this.cloudinaryUpload} >
                        Cloudinary
                     <input type="file" name="image" id="image" multiple />
                        <button>Add photo</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddPhoto;



