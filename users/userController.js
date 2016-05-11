/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var userModel = require(global.pathTo('/users/userModel.js'));
var JsonFormater = require(global.pathTo('/json/jsonFormater.js'));
var validate = require('validator');

/*
 * Public methods
 */
module.exports = {
    get: function(req, res){
        
        var json = new JsonFormater(res);
                
        try {
            // User is
            var userId = req.param(0);

            if (!validate.isNumeric(userId)){
                throw new Error('ERROR_INVALID_USER_ID');
            }
            
            userModel.getUserById( userId, function(err, user){
                
                if (err){
                    json.buildError(err);
                } else {
                    json.build( user );
                }
            });
            
        } catch (err) {
            json.buildError(err);
        };
        
    },
    save: function(req, res){
        var json = new JsonFormater(res);
        
        try{
            var userData = {};
            
            userData.user_id = req.param(0);
            userData.user_name = req.body.user_name;
            userData.user_email = req.body.user_email;

            if (!validate.isNumeric(userData.user_id)){
                throw new Error('ERROR_USER_INVALID_ID');
            }
            
            if (typeof userData.user_name !== 'string'){
                throw new Error('ERROR_USER_INVALID_NAME');
            }
            
            if (!validate.isEmail(userData.user_email)){
                throw new Error('ERROR_USER_INVALID_EMAIL');
            }
            
            var user = userModel.factory(userData);
            user.save(function(err){
                if (err){
                    json.buildError(err);
                } else {
                    json.build(user);
                }
            });
        } catch (err) {
            json.buildError(err);
        }
        
    },
    new: function(req, res){
        var json = new JsonFormater(res);
        
        var userData = {};
        userData.user_name = (req.body.user_name)? req.body.user_name : null;
        userData.user_email = (req.body.user_email)? req.body.user_email : null;
        userData.password = (req.body.password)? req.body.password : null;
        
        try{
            if (!(typeof userData.user_name === 'string' && userData.user_name.length > 2)){
                throw new Error('ERROR_USER_INVALID_NAME');
            }
            if (!validate.isEmail(userData.user_email)){
                throw new Error('ERROR_USER_INVALID_EMAIL');
            }
            if (!(typeof userData.password === 'string' && userData.password.length > 2)){
                throw new Error('ERROR_USER_INVALID_PASSWORD');
            }
            
            userModel.insertUser(userData, function(err, user){
                if (err){
                    json.buildError(err);
                } else {
                    json.build(user);
                }
            });
        } catch(err) {
            json.buildError(err);
        }
        
    },
    delete: function(req, res){
        var json = new JsonFormater(res);
        
        var userId = req.param(0);
        
        try {
            
            userModel.getUserById( userId, function(err, user){
                if (err){
                    json.buildError(err);
                } else {
                    user.delete(function(err){
                        if (err){
                            json.buildError(err);
                        } else {
                            json.build();
                        }
                    });
                }
            });
            
        } catch(err) {
            json.buildError(err);
        }
        
    }
};