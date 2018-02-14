import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import { Photos } from '../api/photos';
import { Categories } from '../api/categories';

class AddPhoto extends Component {

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

    renderCategories = () => {
        return this.state.categories.map((category) => {
            return (
                <option name="category" value={category.name} key={category.name}>{category.name}</option>
            );
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
        //const file = e.target.file.value;
        if (name) {
            Meteor.call('photos.insert', name, description, category);
            e.target.name.value = '';
            //e.target.file.value = '';
            e.target.description.value = '';
            e.target.category.value = 0;
        }
    }

    render() {

        return (
            <div>
                <h3>Add Photo</h3>
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
                        <input type="file" name="photo" id="photo" />
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



/*





 <form onSubmit={onSubmit()} className="add_product" enctype="multipart/form-data">
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="name" className="form-control" placeholder="Photo Title" />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" name="category">

                        <option value="0">--Select Category--</option>

                   
<option value="{{slug}}">{{ name }}</option>

                    </select >
                </div >
    <div className="form-group">
        <label>Photo</label>
        <input type="file" name="productImage" id="productImage" />
    </div>
    <div className="form-group">
        <label>Description</label>
        <textarea name="description" className="form-control"></textarea>
    </div>
    <div>
        <button classNameName="btn btn-success" >Add Photo</button>
        <a href="/" className="btn btn-default">Close</a>
    </div>
            </form >

*/