import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

//register callback for every time SimpleSchema throws an error (then won't need a try/catch block in validation-schemas)
SimpleSchema.defineValidationErrorTransform(error => {
    return new Meteor.Error(400, error.message);
    
});


