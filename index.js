/* global __dirname, global */

'use strict';

/* 
 * Money Controll is a quick small app to manage finantial transactions
 * Simple money flow
 * 
 * @version: 1.0.0
 * @author: mandriani
 */

var path = require('path');

global.config = require('./config/config.js');
// Fix Path problem
global.pathTo = function( uri ){
    return path.normalize(path.resolve(__dirname) + uri);
};

var express = require('express');
var app = express();
var routes = require(global.pathTo('/routes.js'));
var session = require('client-sessions');
var bodyParser = require('body-parser');
var sessionModel = require(global.pathTo('/sessions/sessionModel.js'));
var cookieParser = require('cookie-parser');

// Change the session managment to Mozilla
app.use(session({
  cookieName: global.config.SESSION_COOKIE,
  secret: global.config.SESSION_SECRET,
  duration: global.config.SESSION_DURATION,
  activeDuration: global.config.SESSION_LIFETIME
}));

// Cookies
app.use(cookieParser());

// Add CORS
app.use(function(req, res, next){
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
   next();
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());

// Verify Access Token
app.use(sessionModel.middlewhere);

/**
 * Routing ...
 */
routes.use(app, express);

/**
 * Server starting
 */
var server = app.listen(global.config.SERVER_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('[INFO] My Wallet server is running at http://%s:%s', host, port);
});

