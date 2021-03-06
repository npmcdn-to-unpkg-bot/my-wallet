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
var bodyBuilder = require(global.pathTo('/builder/bodyBuilder.js'));
var statusEnum = require(global.pathTo('/messages/statusEnum.js'));
var validate = require('validator');

/*
 * Get user
 */
function getUserDetails(req, res){
    
    var json = bodyBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.user_id == NaN){
            throw new Error('ERROR_INVALID_USER_ID');
        }
        
        userModel.getUserById( req.currentUser.user_id, function(err, data){
            if (err){
                json.buildError(err);
            } else {
                json.build( { user: data.user.export() } );
            }
        });
        
    } catch(err) {
        json.buildError(err);
    }
};

function saveUserData(req, res){
    var json = bodyBuilder.getBuilder(res);
    
    try{
        var userData = {};

        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }

        userData.user_id = req.currentUser.user_id;
        userData.user_name = req.body.user_name;
        userData.user_email = req.body.user_email;

        if (userData.user_id == NaN){
            throw new Error('ERROR_USERS_INVALID_ID');
        }

        if (typeof userData.user_name !== 'string'){
            throw new Error('ERROR_USERS_INVALID_NAME');
        }

        if (!validate.isEmail(userData.user_email)){
            throw new Error('ERROR_USERS_INVALID_EMAIL');
        }

        var user = userModel.factory(userData);
        user.save(function(err){
            if (err){
                json.buildError(err);
            } else {
                json.build({ user: user.export() });
            }
        });
    } catch (err) {
        json.buildError(err);
    }  
}

function changePassword(req, res){
    var json = bodyBuilder.getBuilder(res);
    
    var _changeUserPassword = function(user, password){
        user.changePass(password, function(err){
            if (err){
                json.buildError(err);
            } else {
                json.build( { user: user.export() } );
            }
        });
    };
    
    try {
        
        var userData = {};
        userData.user_current_password = (req.body.user_current_password)? req.body.user_current_password : null;
        userData.user_email = (req.body.user_email) ? req.body.user_email : null;
        userData.user_new_password = (req.body.user_new_password)? req.body.user_new_password : null;
        
        if (!userData.user_new_password) {
            throw new Error('ERROR_USERS_INVALID_PASSWORD');
        }
        
        userModel.find({
            search: userData.user_email,
            fields: ['user_email'],
            password: userData.user_current_password
        }, function(err, data){
            if (err){
                json.buildError(err);
            } else {
                if (data.users.length == 1){
                    _changeUserPassword(data.users[0], userData.user_new_password);
                } else {
                    json.buildError(new Error('ERROR_USERS_WRONG_USER_OR_PASSWORD'));
                }
            }
        });
        
    } catch (err) {
        json.buildError(err);
    }
};

function insertUser(req, res){
    var json = bodyBuilder.getBuilder(res);

    var userData = {};
    userData.user_name = (req.body.user_name)? req.body.user_name : null;
    userData.user_email = (req.body.user_email)? req.body.user_email : null;
    userData.password = (req.body.password)? req.body.password : null;

    try{
        if (!(typeof userData.user_name === 'string' && userData.user_name.length > 2)){
            throw new Error('ERROR_USERS_INVALID_NAME');
        }
        if (!validate.isEmail(userData.user_email)){
            throw new Error('ERROR_USERS_INVALID_EMAIL');
        }
        if (!(typeof userData.password === 'string' && userData.password.length > 2)){
            throw new Error('ERROR_USER_INVALID_PASSWORD');
        }

        userModel.insertUser(userData, function(err, data){
            if (err){
                json.buildError(err);
            } else {
                json.build({ user: data.user.export() }, statusEnum.CREATED);
            }
        });
    } catch(err) {
        json.buildError(err);
    }
};

function deleteUser(req, res){
    var json = bodyBuilder.getBuilder(res);

    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }

        userModel.getUserById( req.currentUser.user_id, function(err, user){
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

/*
 * Public methods
 */
module.exports = {
    get: getUserDetails,
    save: saveUserData,
    insert: insertUser,
    delete: deleteUser,
    changePassword: changePassword
};