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
//var walletControler = require(global.pathTo('/transactions/walletController.js'));
//var listControler = require(global.pathTo('/transactions/listController.js'));
//var userControler = require(global.pathTo('/transactions/userController.js'));
//var sessionControler = require(global.pathTo('/transactions/sessionController.js'));


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
    app.get(/api\/transactions(?:\/)?(?:page\/([\d]+)\/?)?/, transactionControler.list);
    
    /*
     * Wallets
     */
    
    /*
     * Lists
     */
    
    /*
     * Users
     */
    
    /*
     * Sessions
     */
    
    /*
     * Default
     */
    app.get('*', function(req, res){
        res.sendFile(global.pathTo('/client-app/404.html'));
    });
}

module.exports = {
    use: function( app, express ){
        routeSetup(app, express);
    }
};