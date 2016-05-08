/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Config.js is a module that will manage environmento variables to set application settings
 */

// The Global and Default settings
var config = {};

// Server conf
config.SERVER_PORT = 80;

// Session conf
config.SESSION_SECRET = '';

// MySQL Database
config.DB_HOST = '';
config.DB_BASE = '';
config.DB_USER = '';
config.DB_PASS = '';

// Export the final settings
module.exports = config;