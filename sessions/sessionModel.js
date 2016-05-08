/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

// Require
var userModel = require(global.pathTo('/users/userModel.js'));
var sha1 = require('crypto-js/hmac-sha1');
var AES = require('crypto-js/aes');

var Session = function( request ){
    this.req = request;
    this.user = null;
};

Session.prototype.auth = function(email, pass, next){
    var _self = this;
    
    userModel.find({
            email: email, 
            pass: sha1.encrypt(pass, global.config.SESSION_SECRET)
        },
        function(err, data){
            if (err){
                next(new Error('ERROR_USER_INVALID_CREDENTIALS'));
                return;
            }
        
            _self.user = data;
            _self.req.session = {
                auth: AES.encrypt( JSON.stringify(_self.user), global.config.SESSION_SECRET )
            };
            
            next(false, data);
    });
};

Session.prototype.logout = function(next){
    try{
        this.req.session.destroy();
        next(false);
    } catch(e) {
        next(e);
    }
};

Session.prototype.getCurrentUser = function(next){
    try{
        if (!(this.req.session && typeof this.req.session.auth !== 'undefined')){
            throw new Error('ERROR_SESSION_EXPIRED');
        }
        
        var user = AES.decrypt( this.req.session.auth , global.config.SESSION_SECRET );
        this.user = user;
        
        next(false, user);
    } catch(e) {
        next(e);
    }
};

Session.prototype.use = function(request){
    this.req = request;
};

module.exports = Session;