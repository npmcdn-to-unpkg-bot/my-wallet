/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Routes.js will setup all server API routes
 */

//var contentController = require(global.pathTo('/content/contentController.js'));
var transactionControler = require(global.pathTo('/transactions/transactionController.js'));
var walletControler = require(global.pathTo('/wallets/walletController.js'));
var listControler = require(global.pathTo('/lists/listController.js'));
var userControler = require(global.pathTo('/users/userController.js'));
var sessionControler = require(global.pathTo('/sessions/sessionController.js'));

var jsonResponse = require(global.pathTo('/json/jsonFormater.js'));


function routeSetup(app, express){
    // Static
    app.use('/app', express.static(global.pathTo('/client-app/')));

    /*
     * Angular app
     */
    app.get('/', function(req, res){
        res.sendFile(global.pathTo('/client-app/restrict.html'));
    });
    
    /*
     * Transactions
     */
    app.get(/api\/transactions\/([\d]+)(?:\/)?/, transactionControler.get);
    app.post(/api\/transactions\/([\d]+)(?:\/)?/, transactionControler.save);
    app.post(/api\/transactions\/new(\/)?/, transactionControler.new);
    app.get(/api\/transactions\/delete\/([\d]+)(\/)?/, transactionControler.delete);
    app.get(/api\/transactions(?:\/)?(?:page\/([\d]+)\/?)?/, transactionControler.list);
    
    /*
     * Wallets
     */
    app.get(/api\/wallets\/([\d]+)(?:\/)?/, walletControler.get);
    app.post(/api\/wallets\/([\d]+)(?:\/)?/, walletControler.save);
    app.post(/api\/wallets\/new(\/)?/, walletControler.new);
    app.get(/api\/wallets\/delete\/([\d]+)(\/)?/, walletControler.delete);
    app.get(/api\/wallets(?:\/)?(?:page\/([\d]+)\/?)?/, walletControler.list);
    
    /*
     * Lists
     */
    app.get(/api\/lists\/([\d]+)(?:\/)?/, listControler.get);
    app.post(/api\/lists\/([\d]+)(?:\/)?/, listControler.save);
    app.post(/api\/lists\/new(\/)?/, listControler.new);
    app.get(/api\/lists\/delete\/([\d]+)(\/)?/, listControler.delete);
    app.get(/api\/lists(?:\/)?(?:page\/([\d]+)\/?)?/, listControler.list);
    
    /*
     * Users
     */
    app.get(/api\/users\/([\d]+)(?:\/)?/, userControler.get);
    app.post(/api\/users\/([\d]+)(?:\/)?/, userControler.save);
    app.post(/api\/users\/new(\/)?/, userControler.new);
    app.get(/api\/users\/delete\/([\d]+)(\/)?/, userControler.delete);
    
    /*
     * Sessions
     */
    app.post(/api\/sessions\/auth(\/)?/, sessionControler.auth);
    app.get(/api\/sessions\/logout(\/)?/, sessionControler.logout);
    
    /*
     * Default
     */
    app.get('/api/*', function(req, res, next){
        jsonResponse.use(res);
        jsonResponse.buildError(new Error('ERROR_API_ROUTE_NOT_FOUND'), 500);
        
        if (next){
            next();
        }
    });
    
    app.get('*', function(req, res){
        res.sendFile(global.pathTo('/client-app/404.html'));
    });
}

module.exports = {
    use: function( app, express ){
        routeSetup(app, express);
    }
};