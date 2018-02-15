//import { Meteor } from 'meteor/meteor';
//import { WebApp } from 'meteor/webapp';
//import express from 'express';

//export function setupApi() {
//    console.log('express');
//    const app = express();

//    app.get('/test', (req, res) => {
//        res.status(200).json({message: 'HELLO THERE'});
//    });

//    WebApp.connectHandlers.use(app);
//}




//WebApp.connectHandlers.use((req, res, next) => {
//        console.log('startup',req.url);
//        next();
//        });