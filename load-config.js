/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Config.js is a module that will manage environmento variables to set application settings
 */

'use strict';

// The Global and Default settings
var config = {};
var fs = require('fs');
var userConfigPath = './config/config.js';
var userConfig = {};

// Server conf
config.SERVER_PORT = 80;

// Session conf
config.SESSION_COOKIE = 'MyWalletSession';
config.SESSION_SECRET = 'Jonny Be Goodie'; // Some really safe key
config.SESSION_DURATION = 30 * 60 * 1000;
config.SESSION_LIFETIME = 5 * 60 * 1000;

// MySQL Database
config.DB_HOST = '';
config.DB_BASE = '';
config.DB_USER = '';
config.DB_PASS = '';

// Check user config file
try{
    fs.statSync(userConfigPath);
}catch(err){
    if(err.code == 'ENOENT') {
        console.log('WARN: Creating confi file at "/config/config.js"');
        var fsExtra = require('fs-extra');
        fsExtra.copySync('./config.default.js', './config/config.js');
    }
}

userConfig = require('./config/config.js');

// Replace user's config
for(var x in userConfig){
    config[x] = userConfig[x];
}

// Export the final settings
module.exports = config;