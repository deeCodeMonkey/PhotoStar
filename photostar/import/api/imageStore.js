import { Meteor } from 'meteor/meteor';
//import { FS } from 'meteor/cfs:standard-packages';
import { FS } from 'meteor/cfs:base-package';

//image storage
export const ImageStore = new FS.Collection("ImageStore", {
    stores: [new FS.Store.GridFS("ImageStore")]
});


//permission to upload image
if (Meteor.isServer) {
    ImageStore.allow({
        'insert': function () {
            // add custom authentication code here
            return true;
        },
        'download': function () {
            // add custom authentication code here
            return true;
        },
        'update': function () {
            // add custom authentication code here
            return true;
        }
    });

}





