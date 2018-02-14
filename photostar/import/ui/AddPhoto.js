import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import Photos from '../api/photos';

const AddPhoto = () => {

    onSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        if (name) {
            Meteor.call('photos.insert', name);
            e.target.name.value = '';
        }
    }

    return (
        <div>
            <h3>Add Photo</h3>
            <form onSubmit={onSubmit} className="add_product">
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="name" className="form-control" placeholder="Photo Title" />
                </div>
                
                <div>
                    <button className="btn btn-success" >Add Photo</button>
                    <Link to="/photos" className="btn btn-default">Close</Link>
                </div>
            </form>
        </div>
    );
}

export default AddPhoto;

/*

<div className="form-group">
                    <label>Category</label>
                    <select className="form-control" name="category">
                        <option value="0">--Select Category--</option>
                        <option value="{}">{}</option>
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