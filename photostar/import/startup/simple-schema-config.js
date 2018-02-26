import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import cloudinary from 'cloudinary';

import { cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret } from '../config/keys';

//register callback for every time SimpleSchema throws an error (then won't need a try/catch block in validation-schemas)
SimpleSchema.defineValidationErrorTransform(error => {
    return new Meteor.Error(400, error.message);
    
});


cloudinary.config({
    cloud_name: cloudinary_cloud_name,
    api_key: cloudinary_api_key,
    api_secret: cloudinary_api_secret
})