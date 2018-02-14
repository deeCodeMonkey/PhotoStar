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


////to run on client only
//if (Meteor.isClient) {

//}


//Products = new Mongo.Collection('products');

//ProductsImages = new FS.Collection('ProductsImages', {
//    stores: [new FS.Store.GridFS('ProductsImages')]
//});

////to show images when insecure removed
////what is allowed by users
//ProductsImages.allow({
//    insert: function (fileId, doc) {
//        return true;
//    },
//    //to view
//    download: function (fileId, doc) {
//        return true;
//    }
//});