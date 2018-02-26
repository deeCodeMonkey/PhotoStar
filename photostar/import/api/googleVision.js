import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { google_vision_api_key } from '../config/keys';

if (Meteor.isServer) {

    Meteor.methods({
        //synchronous method
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
        }
    });
}






