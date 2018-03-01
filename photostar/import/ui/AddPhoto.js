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
        errorMessage: null
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
            return (
                <option name="category" value={category.name} key={category.name}>{category.name}</option>
            );
        })
    }

    cloudinaryUpload = async (image) => {
        let cloudinary_URL = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`;

        let photosArray = [];
        for (i = 0; i < image.length; i++) {
            let formData = new FormData();
            formData.append('file', image[i]);
            formData.append('upload_preset', cloudinary_UPLOAD_PRESET);

            await axios.post(cloudinary_URL,
                formData,
            ).then(function (res) {
                photosArray.push(res.data.secure_url);
                return photosArray;
            }).catch(function (err) {
                console.log('ERROR', err);
            });
        }
        return photosArray;
    }

    cloudinaryImageObject = (photoUrlArray) => {
        let photoObjArray = [];
        for (i = 0; i < photoUrlArray.length; i++) {
            photoObjArray.push({
                original: photoUrlArray[i],
                thumbnail: photoUrlArray[i]
            });
        }
        return photoObjArray;
    }

    addPhotos = async (image) => {
        const photoUrlArray = await this.cloudinaryUpload(image);

        const photoObjArray = this.cloudinaryImageObject(photoUrlArray);

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

        this.createGallery(title, description, category, userId, userEmail, image);
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
                        <input type="text" name="title" className="form-control" placeholder="Photo Title" />
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

            </div>
        );
    }
}

export default AddPhoto;



