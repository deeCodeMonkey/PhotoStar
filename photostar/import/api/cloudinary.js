import cloudinary from 'cloudinary';
import axios from 'axios';

import { cloudinary_cloud_name, cloudinary_UPLOAD_PRESET } from '../config/keys';

if (Meteor.isServer) {

    Meteor.methods({
        //'cloudinary.insert': async function (image) {
        //    let cloudinary_URL = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`;
        //    console.log('ran=========================');
        //    let photosArray = [];
        //    for (i = 0; i < image.length; i++) {
        //        let formData = new FormData();
        //        formData.append('file', image[i]);
        //        formData.append('upload_preset', cloudinary_UPLOAD_PRESET);

        //        await axios.post(cloudinary_URL,
        //            formData,
        //        ).then(function (res) {
        //            console.log('RESULT=============', res);
        //            photosArray.push(res.data.secure_url);
        //            console.log('PROMISES ARRAY=============', photosArray);
        //            return photosArray;
        //        }).catch(function (err) {
        //            console.log('ERROR===============', err);
        //        });
        //    }
        //    return photosArray;
        //}





    })
}



