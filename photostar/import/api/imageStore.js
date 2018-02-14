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


////runs on server and client, will need to import to client and server 
//Meteor.methods({
//    'image.insert': function (image) {
//        //for (var i = 0, ln = image.length; i < ln; i++) {
//        ImageStore.insert(image, function (err, result) {
//            if (!err) {
//                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
//                const photoImage = '/cfs/files/photoImage/' + result._id;
//                return photoImage;
//            } else {
//                console.log('Error ', err);
//            }
//            });
//        //}
//    }
//});


