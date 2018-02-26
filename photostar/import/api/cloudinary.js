import cloudinary from 'cloudinary';
import axios from 'axios';

if (Meteor.isServer) {

    Meteor.methods({
        'cloudinary.insert': function (localImagePathArray) {
            let multipleUpload = new Promise(async (resolve, reject) => {
                let upload_len = localImagePathArray.length;
                let upload_res = new Array();

                for (let i = 0; i < upload_len; i++) {
                    let filePath = localImagePathArray[i];
                    await cloudinary.v2.uploader.upload(filePath, (error, result) => {
                        if (upload_res.length === upload_len) {
                            /* resolve promise after upload is complete */
                            resolve(upload_res)
                        } else if (result) {
                            upload_res.push(result.public_id);
                            console.log('PROMISE RESOLVE===========', result.public_id, '****************', result);
                        } else if (error) {
                            console.log('PROMISE ERROR===========', error)
                            reject(error)
                        }

                    })

                }
            })
                .then((result) => result)
                .catch((error) => error);
        },
        'cloudinary.upload': function (localImagePath) {
            cloudinary.v2.uploader.upload(localImagePath, { use_filename: true }, function (error, result) {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            },
                {
                    resource_type: "auto"
                });
        },
        'cloudinary.insertOne': function (formData, url) {
            var response = axios.post(url,
                formData,
            ).then(function (res) {
                console.log('RESULT=============', res);
            }).catch(function (err) {
                console.log('ERROR===============', err);
            });
            return response;

        }

    })
}



