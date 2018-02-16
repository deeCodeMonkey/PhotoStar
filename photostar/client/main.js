import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import { routes } from '../import/routes/Layout';

Meteor.startup(() => {
    ReactDOM.render(routes, document.getElementById('app'));
    
});