/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var sessionModel = require(global.pathTo('/sessions/sessionModel.js'));

var startApplication = function(req, res){
    if (req.cookies.myWalletAuth){
        var session = sessionModel.getSession(req);
        session.getCurrentUser(req.cookies.myWalletAuth, function(err, user){
            if (err){
                res.sendFile(global.pathTo('/client-app/public.html'));
            } else {
                req.currentUser = user;
                res.sendfile(global.pathTo('/client-app/restrict.html'));
            }
        });
    } else {
        res.sendFile(global.pathTo('/client-app/public.html'));
    }
};

var startRegister = function(req, res){
    res.sendFile(global.pathTo('/client-app/register.html'));
};

var startLogin = function(req, res){
    res.sendFile(global.pathTo('/client-app/login.html'));
};

module.exports = {
    application: startApplication,
    register: startRegister,
    login: startLogin
};