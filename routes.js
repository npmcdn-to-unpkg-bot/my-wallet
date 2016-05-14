/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Routes.js will setup all server API routes
 */

//var appController = require(global.pathTo('/main/mainController.js'));
//var transactionControler = require(global.pathTo('/transactions/transactionController.js'));
//var walletControler = require(global.pathTo('/wallets/walletController.js'));
//var listControler = require(global.pathTo('/lists/listController.js'));
var userControler = require(global.pathTo('/users/userController.js'));
var sessionControler = require(global.pathTo('/sessions/sessionController.js'));

var bodyBuilder = require(global.pathTo('/builder/bodyBuilder.js'));
var messageEnum = require(global.pathTo('/messages/messageEnum.js'));
var statusEnum = require(global.pathTo('/messages/statusEnum.js'));

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
    app.get('/', function(req, res){
        res.sendFile(global.pathTo('/client-app/restrict.html'));
    });
    
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
    app.get('/api/v1/transactions/', underConstruction); // All transactions
    app.post('/api/v1/transactions/', underConstruction); // New Transactions
    app.get('/api/v1/transactions/:transactionId', underConstruction); // Single Transaction
    app.post('/api/v1/transactions/:transactionId', underConstruction); // Update single
    app.post('/api/v1/transactions/:transactionId/delete', underConstruction); // Delete transaction
    
    /*
     * Wallets
     */
    app.get('/api/v1/wallets/', underConstruction); // All transactions
    app.post('/api/v1/wallets/', underConstruction); // New Transactions
    app.get('/api/v1/wallets/:walletId', underConstruction); // Single Transaction
    app.post('/api/v1/wallets/:walletId', underConstruction); // Update single
    app.post('/api/v1/wallets/:walletId/delete', underConstruction); // Delete transaction
    
    /*
     * Lists
     */
    app.get('/api/v1/lists/', underConstruction); // All transactions
    app.post('/api/v1/lists/', underConstruction); // New Transactions
    app.get('/api/v1/lists/:listId', underConstruction); // Single Transaction
    app.post('/api/v1/lists/:listId', underConstruction); // Update single
    app.post('/api/v1/lists/:listId/delete', underConstruction); // Delete transaction
    
    /*
     * Users
     */
    app.post('/api/v1/users/', userControler.insert); // New Transactions
    app.get('/api/v1/users/details/', userControler.get); // Single Transaction
    app.post('/api/v1/users/details/', userControler.save); // Update single
    app.post('/api/v1/users/delete/', userControler.delete); // Delete transaction
    
    /*
     * Sessions
     */
    app.post('/api/v1/sessions/auth/', sessionControler.auth);
    app.get('/api/v1/sessions/logout/', sessionControler.logout);
    
    /*
     * Default
     */
    app.get('/api/*', function(req, res, next){
        var body = bodyBuilder.getBuilder(res);
        body.buildError(new Error(statusEnum.NOT_FOUND));
        
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