/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Routes.js will setup all server API routes
 */

var clientControler = require(global.pathTo('/client-access/clientController.js'));
var transactionControler = require(global.pathTo('/transactions/transactionController.js'));
var walletControler = require(global.pathTo('/wallets/walletController.js'));
var listControler = require(global.pathTo('/lists/listController.js'));
var userControler = require(global.pathTo('/users/userController.js'));
var sessionControler = require(global.pathTo('/sessions/sessionController.js'));

var bodyBuilder = require(global.pathTo('/builder/bodyBuilder.js'));

var underConstruction = function(req, res){
    var body = bodyBuilder.getBuilder(res);
    body.build('Under construction');
};

function routeSetup(app, express){
    // Static
    app.use('/app', express.static(global.pathTo('/client-app/')));

    /*
     * Angular app
     */
    app.get('/', clientControler.application);
    app.get('/register/', clientControler.register);
    app.get('/login/', clientControler.login);
    
    /*
     * Rout behaviour
     * GET /api/{version}/{module} // List
     * POST /api/{version}/{module} // Add new
     * GET /api/{version}/{module}/:id // Get single object
     * POST /api/{version}/{module}/:id // Update data
     * POST /api/{version}/{module}/:id/delete // Delete node
     * 
     * ANY /api/{version}/{module}/?_param={value}
     *      _page={number}
     *      _search={string}
     *      _itens_per_page:{number} (max 100)
     *      _sort={string}
     */
    
    /*
     * Transactions
     */
    app.get('/api/v1/transactions/', transactionControler.find); // All transactions
    app.post('/api/v1/transactions/', transactionControler.insert); // New Transactions
    app.get('/api/v1/transactions/:transactionId', transactionControler.get); // Single Transaction
    app.post('/api/v1/transactions/:transactionId', transactionControler.save); // Update single
    app.post('/api/v1/transactions/:transactionId/delete', transactionControler.delete); // Delete transaction
    
    /*
     * Wallets
     */
    app.get('/api/v1/wallets/', walletControler.find); // All Wallets
    app.post('/api/v1/wallets/', walletControler.insert); // New Wallet
    app.get('/api/v1/wallets/:walletId', walletControler.get); // Single Wallet
    app.post('/api/v1/wallets/:walletId', walletControler.save); // Update single Wallet
    app.post('/api/v1/wallets/:walletId/delete', walletControler.delete); // Delete Wallet
    
    /*
     * Lists
     */
    app.get('/api/v1/lists/', listControler.find); // All Lists
    app.post('/api/v1/lists/', listControler.insert); // New List
    app.get('/api/v1/lists/:listId', listControler.get); // Single List
    app.post('/api/v1/lists/:listId', listControler.save); // Update single List
    app.post('/api/v1/lists/:listId/delete', listControler.delete); // Delete List
    
    /*
     * Users
     */
    app.post('/api/v1/users/', userControler.insert); // New User
    app.post('/api/v1/users/password/', userControler.changePassword); // Change Password
    app.get('/api/v1/users/details/', userControler.get); // Single User
    app.post('/api/v1/users/details/', userControler.save); // Update single User
    app.post('/api/v1/users/delete/', userControler.delete); // Delete User
    
    /*
     * Sessions
     */
    app.post('/api/v1/sessions/auth/', sessionControler.auth);
    app.post('/api/v1/sessions/renew/', sessionControler.renew);
    app.get('/api/v1/sessions/logout/', sessionControler.logout);
    
    /*
     * Default
     */
    app.get(/api.*/, function(req, res, next){
        var body = bodyBuilder.getBuilder(res);
        body.buildError(new Error('ERROR_API_ROUTE_NOT_FOUND'));
    });
    
    app.get('*', function(req, res){
        res.status(404).sendFile(global.pathTo('/client-app/404.html'));
    });
}

module.exports = {
    use: function( app, express ){
        routeSetup(app, express);
    }
};