import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
//reactive client setup for aggregating in Mongodb
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

//users can add photos
export const Photos = new Mongo.Collection('photos');
//reactive client setup for aggregating in Mongodb
//client subset of Photos collection
export const clientReport = new Mongo.Collection('clientReport');
export const reviewsCollection = new Mongo.Collection('reviewsCollection');


//to run on server only
if (Meteor.isServer) {
    //publish on server. Subscribe in certain react components.
    Meteor.publish('allPhotos', () => {
        //subscriber to get. User can see all for this particular publish.
        return Photos.find({});
    });

    //reactive client setup for aggregating in Mongodb
    Meteor.publish('topPhotos', function () {
        ReactiveAggregate(this, Photos,
            [{
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: '$_id',
                    ratingsCount: { $sum: 1 },
                    averageRating: { $avg: "$reviews.rating" },
                    image: { "$first": "$file" },
                    //to get whole document 
                    //document: { "$first": "$$CURRENT" }
                }
            },
            {
                $sort: {
                    averageRating: -1
                }
            }],
            { clientCollection: "clientReport" });
    });

    //reviews list by descending review date
    Meteor.publish('reviewsList', function (photoId) {
        ReactiveAggregate(this, Photos,
            [{
                $match: { _id: photoId }
            },
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: '$reviews.reviewedBy',
                    reviewCreatedAt: { "$first": "$reviews.reviewCreatedAt" },
                    rating: { "$first": "$reviews.rating" },
                    body: { "$first": "$reviews.body" },
                    reviewedBy: { "$first": "$reviews.reviewedBy" }
                }
            },
            {
                $sort: {
                    reviewCreatedAt: -1
                }
            }],
            { clientCollection: "reviewsCollection" });
    });
}


//runs on server and client, will need to import to client and server 
Meteor.methods({
    'photos.insert': async function (name, description, category, file, userId, userEmail) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        //validate inputs
        new SimpleSchema({
            name: {
                type: String,
                min: 1,
                max: 75,
                label: 'Title of your image'
            },
            description: {
                type: String,
                min: 1,
                max: 250,
                label: 'Your image description'
            },
            category: {
                type: String,
                min: 1,
                label: 'Category Of Image'
            },
            file: {
                type: String,
                label: 'Image File'
            },
            userId: {
                type: String,
                min: 1,
                label: 'User ID'
            },
            userEmail: {
                type: String,
                regEx: SimpleSchema.RegEx.Email,
                label: 'User Email'
            }
        }).validate({ name, description, category, file, userId, userEmail });

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
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        new SimpleSchema({
            photoId: {
                type: String,
                min: 1,
                label: 'Image ID'
            },
            rating: {
                type: Number,
                min: 1,
                label: 'Your rating'
            },
            body: {
                type: String,
                min: 1,
                max: 250,
                label: 'Your review comment'
            },
            reviewCreatedAt: {
                type: Date,
                min: 1,
                label: 'Reviewed date'
            },
            reviewedBy: {
                type: String,
                regEx: SimpleSchema.RegEx.Email,
                label: 'Reviewer Email'
            }
        }).validate({ photoId, rating, body, reviewCreatedAt, reviewedBy });

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
    }
});






