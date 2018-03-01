import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class Accounts extends Component {

    componentDidMount() {
        //Blaze returns reference to the template that was rendered. Use reference for clean up.
        //renders log-in button template to the DOM node
        this.view = Blaze.render(Template.loginButtons,
            ReactDOM.findDOMNode(this.refs.container));
    }

    componentWillUnmount() {
        //find forms created and destroy
        Blaze.remove(this.view);
    }

    render() {
        return (
            <div ref="container"></div>
        );
    }

}