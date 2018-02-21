import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:base-package';

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

    onSubmit = async (e) => {
        e.preventDefault();

        const userId = Meteor.userId();
        const userEmail = Meteor.user().emails[0].address;

        const name = e.target.name.value;
        const description = e.target.description.value;
        const category = e.target.category.value;

        const image = e.target.image.files[0];

        if (image) {

            fsFile = new FS.File(image)

            let file = await ImageStore.insert(fsFile, function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                if (err) {
                    throw new Meteor.Error(err);
                }
                return fileObj;
            });

            const photoImage = '/cfs/files/ImageStore/' + file._id;
            Meteor.call('photos.insert',
                name,
                description,
                category,
                photoImage,
                userId,
                userEmail,
                (error, result) => {
                    if (error) {
                        console.log('ERROR', error);
                        this.setState({ errorMessage: error.reason });
                    } else {
                        this.props.history.push(`/review/${result}`);
                    }
                });

        }
        else {
            console.log('Photo required.');
            this.setState({ errorMessage: 'Photo required.'});
        }
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
                        <input type="file" name="image" id="image" />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" className="form-control"></textarea>
                    </div>

                    <div>
                        <button className="btn btn-success" >Add Photo</button>
                        <Link to="/photos" className="btn btn-default">Close</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddPhoto;



