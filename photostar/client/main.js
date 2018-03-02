import "react-image-gallery/styles/css/image-gallery.css";
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { routes } from '../import/routes/Routes';

import '../import/config/startup/simple-schema';


Meteor.startup(() => {
    ReactDOM.render(routes, document.getElementById('app'));
    
});