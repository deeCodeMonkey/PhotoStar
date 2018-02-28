import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import SimpleSchema from 'simpl-schema';

import { google_vision_api_key } from '../config/keys';

import { Photos } from './photos';

if (Meteor.isServer) {

    Meteor.methods({
        'googleVisionAPI.label': function (imageUri) {
            console.log('Method.googleVision.api for', imageUri);
            var apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + google_vision_api_key;
            // query the API
            var response = HTTP.post(apiUrl, {
                headers: {
                    'content-type': 'application/json'
                },
                data: {
                    "requests": [
                        {
                            "image": {
                                "source": {
                                    "imageUri": imageUri
                                }
                            },
                            "features": [
                                {
                                    "type": "LABEL_DETECTION"
                                }
                            ]
                        }
                    ]
                }
            }).data;
            return response;
        },
        'googleVisionAPI.insertLabels': function (tags, galleryId) {
            //validate inputs
            new SimpleSchema({
                tags: {
                    type: Array,
                    min: 1,
                    label: 'Tags Array'
                },
                'tags.$': {
                    type: String,
                    min: 1,
                    label: 'Individual Tags'
                }
            }).validate({ tags });

            Photos.update({
                _id: galleryId
            }, {
                    $set: { tags }
                },
                (error, result) => {
                    if (error) {
                        console.log('MongoDB ERROR:', error);
                    }
                    console.log('TAGS ADDED', result);
                });
        }

    })
}






