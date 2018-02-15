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

//        fsFile = new FS.File(image)

//        //for (var i = 0, ln = fsFile.length; i < ln; i++) {
//        ImageStore.insert(fsFile, function (err, fileObj) {
//            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
//            if (!err) {
//                console.log('fileObj=====', fileObj);
//                const photoImage = '/cfs/files/ImageStore/' + fileObj._id;
//                Meteor.call('photos.insert', name, description, category, photoImage);
//            } else {
//                throw new Meteor.Error(err);
//            }
//        });
//            //}
//    }
//});


