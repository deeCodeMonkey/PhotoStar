import { Meteor } from 'meteor/meteor';
//import { FS } from 'meteor/cfs:standard-packages';
import { FS } from 'meteor/cfs:base-package';

//image storage
export const ImageStore = new FS.Collection("ImageStore", {
    stores: [new FS.Store.GridFS("ImageStore")],
    filter: {
        allow: {
            //any image extension
            contentTypes: ['image/*']
        },
        onInvalid: function (message) {
            console.log('Can only upload images.');
        }
    }
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

//Meteor.methods({
//    'imageStore.insert': function (images) {
//        console.log('-------input images------------', images, 'length is', images.length);
//        debugger;
//        let imagesArray = [];


//        for (let i = 0; i < images.length; i++ ) {
//            let fsFile = new FS.File(images[i]);
//            console.log('++++++++fsFile is+++++++', fsFile);
//            ImageStore.insert(fsFile, function (err, fileObj) {
//                if (err) {
//                    throw new Meteor.Error(err);
//                }

//                console.log('----Adding----', fileObj._id);
//                imagesArray.push('/cfs/files/ImageStore/' + fileObj._id);
//            });
//        }
//        console.log('======== imageArray ==========', imagesArray);
//        return imagesArray;
//    }
//});

//getFiles = async (images) => {
//    let imagesArray = [];
//    for (let i = 0; i < images.length; i++) {
//        //let fsFile = new FS.File(images[i])
//        await ImageStore.insert(images[i], function (err, fileObj) {
//            if (err) {
//                throw new Meteor.Error(err);
//            }
//            imagesArray.push('/cfs/files/ImageStore/' + fileObj._id);
//        });
//    }
//    return imagesArray;
//}





