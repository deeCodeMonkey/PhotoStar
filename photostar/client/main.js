import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { routes } from '../import/routes/Layout';

import '../import/startup/simple-schema-config';
import "react-image-gallery/styles/css/image-gallery.css";


Meteor.startup(() => {
    ReactDOM.render(routes, document.getElementById('app'));
    
});