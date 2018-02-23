import { Meteor } from 'meteor/meteor';

import '../import/api/categories';
import '../import/api/photos';
import '../import/api/imageStore';
import '../import/startup/simple-schema-config';

//__meteor_runtime_configuration__.ROOT_URL = 'http://localhost:4000';



Meteor.startup(() => {
     Meteor.absoluteUrl('http://localhost:4000')
});
