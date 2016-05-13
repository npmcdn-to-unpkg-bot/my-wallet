/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var sessionModel = require(global.pathTo('/sessions/sessionModel.js'));
var JsonFormater = require(global.pathTo('/json/jsonFormater.js'));
var validate = require('validator');

/**
 * Check if there are an current session and if true send the current user
 * 403: FORBIDEN
 * @param {function} next The callback function
 * @returns {undefined}
 */
function validateSession( req, next ){
    var session = sessionModel.getSession(req);
    session.getCurrentUser(function(err, user){
        if (err){
            next(err);
        } else {
            next(false, user);
        }
    });
};

// route functions
function findLists( req, res ){
    // Response controller
    var json = new JsonFormater(res);
    
    // Restrict call
    var find = function(err, user){
        
        // get parameters
        var listName = req.body.list_name;
        
    };
    
    // Validations
    try{
        validateSession( req, find);
    } catch (err){
        json.buildError(err);
    }
};

function getLists( req, res ){};

function saveList( req, res ){};

function insertList( req, res ){};

function deleteList( req, res ){};

/*
 * Public methods
 */
module.exports = {
    find: findLists, 
    get: getLists,
    save: saveList,
    new: insertList,
    delete: deleteList
};