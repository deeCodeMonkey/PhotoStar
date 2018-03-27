//'photoId' is the photo gallery id

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
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
                    image: { "$first": "$photoImages" },
                    category: { "$first": "$category" },
                    title: { "$first": "$title" }
                    //to get whole document 
                    //document: { "$first": "$$CURRENT" }
                }
            },
            {
                $sort: {
                    averageRating: -1,
                    ratingsCount: -1
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
                    heading: { "$first": "$reviews.heading" },
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



    Meteor.methods({
        'photos.insert': async function (title, description, category, photoImages, userId, userEmail) {
            if (!this.userId) {
                throw new Meteor.Error('Not authorized.');
            }

            //validate inputs
            new SimpleSchema({
                title: {
                    type: String,
                    min: 1,
                    max: 75,
                    label: 'Title of your images'
                },
                description: {
                    type: String,
                    min: 1,
                    label: 'Your image description'
                },
                category: {
                    type: String,
                    min: 1,
                    label: 'Category Of Image'
                },
                photoImages: {
                    type: Array,
                    minCount: 1,
                    maxCount: 6,
                    label: 'Image File(s) Array'
                },
                'photoImages.$': {
                    type: Object,
                    label: 'Image File(s)'
                },
                'photoImages.$.original': {
                    type: String,
                    label: 'Image Original Url'
                },
                'photoImages.$.thumbnail': {
                    type: String,
                    label: 'Image Thumbnail Url'
                },
                'photoImages.$.public_id': {
                    type: String,
                    label: 'Image Public Id'
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
            }).validate({ title, description, category, photoImages, userId, userEmail });

            //photo gallery id is also 'photoId'
            let id = await Photos.insert({
                title,
                description,
                category,
                photoImages,
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


        'photos.review.insert': function (photoId, rating, body, heading, reviewCreatedAt, reviewedBy) {
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
                heading: {
                    type: String,
                    min: 1,
                    max: 150,
                    label: 'Your review heading'
                },
                body: {
                    type: String,
                    min: 1,
                    max: 750,
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
            }).validate({ photoId, rating, body, heading, reviewCreatedAt, reviewedBy });

            Photos.update({
                _id: photoId
            }, {
                    $push: {
                        reviews: {
                            rating,
                            body,
                            heading,
                            reviewCreatedAt,
                            reviewedBy
                        }
                    }
                }
            );
        },


        'photos.remove': function (photoId, publicIds) {
            if (!this.userId) {
                throw new Meteor.Error('Not authorized.');
            }
            new SimpleSchema({
                photoId: {
                    type: String,
                    min: 1,
                    label: 'Image ID'
                },
                publicIds: {
                    type: Array,
                    label: 'Images Public Ids Array'
                },
                'publicIds.$': {
                    type: String,
                    minCount: 1,
                    maxCount: 6,
                    label: 'Image Public Id'
                }
            }).validate({ photoId, publicIds });

            Photos.remove({
                _id: photoId
            });
            Meteor.call('cloudinary.remove', publicIds);
        }, 
        'photos.removeTag': function (tagKeyword, photoId) {
            if (!this.userId) {
                throw new Meteor.Error('Not authorized.');
            }
            new SimpleSchema({
                photoId: {
                    type: String,
                    min: 1,
                    label: 'Image ID'
                },
                tagKeyword: {
                    type: String,
                    min: 1,
                    label: 'Tag Keyword'
                }
            }).validate({ photoId, tagKeyword });

            Photos.update(
                { _id: photoId },
                { $pull: { 'tags': tagKeyword } }
            );
        },
        'photos.addTag': function (tagKeyword, photoId) {
            if (!this.userId) {
                throw new Meteor.Error('Not authorized.');
            }
            new SimpleSchema({
                photoId: {
                    type: String,
                    min: 1,
                    label: 'Image ID'
                },
                tagKeyword: {
                    type: String,
                    min: 1,
                    label: 'Tag Keyword'
                }
            }).validate({ photoId, tagKeyword });

            Photos.update(
                { _id: photoId },
                { $push: { 'tags': tagKeyword } }
            );
        }

    });
}



