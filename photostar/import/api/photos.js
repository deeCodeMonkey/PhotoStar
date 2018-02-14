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
    'photos.insert': function (name, description, category, file) {
        Photos.insert({
            name,
            description,
            category,
            file,
            createdAt: new Date()
        });
    }
});






