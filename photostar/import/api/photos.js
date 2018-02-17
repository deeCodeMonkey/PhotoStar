import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

//users can add photos
export const Photos = new Mongo.Collection('photos');


//to run on server only
if (Meteor.isServer) {
    //publish on server. Subscribe in certain react components.
    Meteor.publish('allPhotos', () => {
        //subscriber to get. User can see all for this particular app.
        return Photos.find({})
    });

}


//runs on server and client, will need to import to client and server 
Meteor.methods({
    'photos.insert': async function (name, description, category, file) {
        let id = await Photos.insert({
            name,
            description,
            category,
            file,
            createdAt: new Date()
        }, (error, result) => {
            if (error) {
                console.log('ERROR', error);
            }
            console.log('***Mongo db returns:' + result);
            return result;
            });
        return id;
    },
    'photos.review.insert': function (photoId, rating, body, reviewCreatedAt) {
        Photos.update({
            _id: photoId
        }, {
                $push: {
                    reviews: {
                        rating,
                        body,
                        reviewCreatedAt
                    }
                }
            }
        );
    },
    'photo.review': function (photoId) {
        Photos.find({
            _id: photoId
        }).fetch();
    },
});






