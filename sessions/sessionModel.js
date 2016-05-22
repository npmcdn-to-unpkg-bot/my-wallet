/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

// Require
var userModel = require(global.pathTo('/users/userModel.js'));
var sha1 = require('crypto-js/hmac-sha1');
var jwt = require('jsonwebtoken');

var jwtConfig = {
    expiresIn: global.config.SESSION_EXPIRES
};

var Session = function( request ){
    this.req = request;
    this.user = null;
};

Session.prototype.auth = function(email, pass, next){
    var _self = this;
    
    userModel.findAccount({
            user_email: email,
            password: pass
        },
        function(err, data){
            if (err){
                next(new Error('ERROR_SESSION_INVALID_CREDENTIALS'));
                return;
            }
            
            _self.user = data.user;
            var auth = _self.generateToken(_self.user);
            
            _self.req.session = {
                auth: auth
            };
            
            next(false, {auth: auth});
    });
};

Session.prototype.generateToken = function(user){
    return jwt.sign( user, global.config.SESSION_SECRET, jwtConfig );
};

Session.prototype.logout = function(next){
    try{
        this.req.session.destroy();
        next(false);
    } catch(e) {
        next(e);
    }
};

Session.prototype.getCurrentUser = function(token, next){
    try{
        var user = jwt.verify(token, global.config.SESSION_SECRET);
        this.user = userModel.factory(user);
        next(false, user);
    } catch(e) {
        next(new Error('ERROR_SESSION_EXPIRED'));
    }
};

/**
 * Session.hasPermission( user, capability, next )
 * @param {User} user An User object
 * @param {string} capability an permission string
 * @param {function} next The callback function 
 * @returns {undefined}
 */
Session.prototype.hasPermission = function( user, capability, next ){
    user.getRoles( function( roles ){
        if (roles.indexOf(capability) > -1){
            next(false, false);
        } else {
            next(false, true);
        }
    });
};

Session.prototype.use = function(request){
    this.req = request;
};

module.exports = {
    getSession: function(req, res){
        return new Session(req, res);
    },
    middlewhere: function(req, res, next){
        var token = req.headers['x-access-token'] || req.body.token || req.query.token || null;
        var session = new Session(req, res);
        session.getCurrentUser(token, function(err, user){
            if (err){
                req.currentUser = null;
            } else {
                req.currentUser = user;
            }
            next();
        });
    }
};