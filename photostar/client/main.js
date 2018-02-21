import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { routes } from '../import/routes/Layout';

import '../import/startup/simple-schema-config';

Meteor.startup(() => {
    ReactDOM.render(routes, document.getElementById('app'));
    
});