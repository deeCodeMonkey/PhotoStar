import cloudinary from 'cloudinary';
import axios from 'axios';

import { cloudinary_cloud_name, cloudinary_UPLOAD_PRESET } from '../config/keys';

if (Meteor.isServer) {

    Meteor.methods({
        'cloudinary.remove': function (publicIds) {
            cloudinary.v2.api.delete_resources(publicIds,
                function (error, result) { console.log(result); });
        }

    })
}



