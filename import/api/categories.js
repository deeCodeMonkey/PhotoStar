import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

//admin enter categories through console
export const Categories = new Mongo.Collection('categories');

//to run on server only
if (Meteor.isServer) {
    //publish on server. Subscribe in certain react components.
    Meteor.publish('allCategories', () => {
        //subscriber to get. User can see all for this particular app.
        return Categories.find({})
    });
   
}


