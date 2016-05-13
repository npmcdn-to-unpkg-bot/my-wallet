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
var bodyBuilder = require(global.pathTo('/json/bodyBuilder.js'));
var sessionModel = require(global.pathTo('/sessions/sessionModel.js'));
var validate = require('validator');

/*
 * Get user
 */
function getUserDetails(req, res){
    var json = bodyBuilder.getBuilder(res);
    var session = sessionModel.getSession(req);
    
    var checkPermission = function( err, currentUser ){
        try{
            if (err){
                throw new Error(bodyBuilder.statusEnum.UNAUTHORIZED + ': ERROR_USERS_UNAUTHORIZED');
            }
            getDetails(false, currentUser.user_id);
        } catch(err){
            next(err);
        }
    };
    
    var getDetails = function( err, userId ){
        // User id
        try{
            if (!validate.isNumeric(userId)){
                throw new Error('ERROR_INVALID_USER_ID');
            }
            
            userModel.getUserById( userId, function(err, user){
                if (err){
                    json.buildError(err);
                } else {
                    json.build( user.export() );
                }
            });
            
        } catch (err) {
            json.buildError(err);
        }
    };
    
    session.getCurrentUser( checkPermission );
};

function saveUserData(req, res){
    var json = bodyBuilder.getBuilder(res);
    var session = sessionModel.getSession(req);
    
    var validateUserData = function(err, currentUser){
        try{
            var userData = {};
            
            if (err){
                throw err;
            }
            
            userData.user_id = currentUser.user_id;
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
                    json.build(user.export());
                }
            });
        } catch (err) {
            json.buildError(err);
        }  
    };
    
    session.getCurrentUser( validateUserData );
}

function insertUser(req, res){
    var json = bodyBuilder.getBuilder(res);

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
                json.build(user.export(), bodyBuilder.statusEnum.CREATED);
            }
        });
    } catch(err) {
        json.buildError(err);
    }
};

function deleteUser(req, res){
    var json = bodyBuilder.getBuilder(res);
    var session = sessionModel.getSession(req);
        
    var deleteCurrentUser = function(err, currentUser){
        try {
            if (err){
                throw err;
            }
            
            userModel.getUserById( currentUser.user_id, function(err, user){
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
    };
    
    session.getCurrentUser( deleteCurrentUser );
}

/*
 * Public methods
 */
module.exports = {
    get: getUserDetails,
    save: saveUserData,
    insert: insertUser,
    delete: deleteUser
};