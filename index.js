/* global __dirname, global */

'use strict';

/* 
 * Money Controll is a quick small app to manage finantial transactions
 * Simple money flow
 * 
 * @version: 1.0.0
 * @author: mandriani
 */

var express = require('express');
var app = express();
// var session = require('client-sessions');

// Fix the path problem
global.path = __dirname;

// Change the session managment to Mozilla
//app.use(session({
//  cookieName: 'session',
//  secret: 'Jhonny Be Goodie',
//  duration: 30 * 60 * 1000,
//  activeDuration: 5 * 60 * 1000
//}));

/**
 * Routing ...
 */

// Static
app.use('/client-app', express.static(__dirname + '/client-app/'));

// Angular app
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client-app/restrict.html');
});

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
