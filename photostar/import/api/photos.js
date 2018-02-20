import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

//users can add photos
export const Photos = new Mongo.Collection('photos');

//to run on server only
if (Meteor.isServer) {
    //publish on server. Subscribe in certain react components.
    Meteor.publish('allPhotos', () => {
        //subscriber to get. User can see all for this particular publish.
        return Photos.find({});
    });
   
}


//runs on server and client, will need to import to client and server 
Meteor.methods({
    'photos.insert': async function (name, description, category, file, userId, userEmail) {
        let id = await Photos.insert({
            name,
            description,
            category,
            file,
            userId,
            userEmail,
            createdAt: new Date()
        }, (error, result) => {
            if (error) {
                console.log('MongoDB ERROR:', error);
            }
            return result;
            });
        return id;
    },
    'photos.review.insert': function (photoId, rating, body, reviewCreatedAt, reviewedBy) {
        Photos.update({
            _id: photoId
        }, {
                $push: {
                    reviews: {
                        rating,
                        body,
                        reviewCreatedAt,
                        reviewedBy
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
    'photo.topReviews': function () {
        Photos.aggregate([
            {
                '$unwind': "$reviews"
            },
            {
                '$group': {
                    _id: '$_id',
                    ratingsCount: { $sum: 1 },
                    averageRating: { $avg: "$reviews.rating" }
                }
            },
            {
                '$sort': {
                    averageRating: -1
                }
            },
            { "$project": { averageRating: true, _id: false } }
        ]);
        //    .then((result) => {
        //    console.log('============',result);;
        //});
    }
});






