/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Manage the user behaviour
 */

// Requires
var jsonBuilder = require(global.pathTo('/builder/bodyBuilder.js'));
var walletModel = require(global.pathTo('/wallets/walletModel.js'));
var validate = require('validator');

// route functions
function findWallets( req, res ){
    // Response controller
    var json = jsonBuilder.getBuilder(res);
    
    // Validations
    try{
    
        var search = {};
        
        search.find = req.query._search || null;
        search.page = req.query._page || 0;
        search.items = req.query._items_per_page || 9;
        search.sort = req.query._sort || null;
        
        // validations
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (search.find != null && typeof search.find !== 'string'){
            throw new Error('ERROR_WALLETS_INVALID_SEARCH_QUERY');
        }
        
        if (!Number.isInteger(search.page)){
            throw new Error('ERROR_WALLETS_INVALID_PAGE');
        }
        
        if (!Number.isInteger(search.items)){
            throw new Error('ERROR_WALLETS_INVALID_LIST_SIZE');
        };
        
        if (search.sort !== null && typeof search.sort !== 'string'){
            throw new Error('ERROR_WALLETS_INVALID_SORT');
        }
        
        search.user_id = req.currentUser.user_id;
        
        walletModel.find( search, function( err, lists ){
            if (err){
                json.buildError(err);
            } else {
                json.build(lists);
            }
        });
        
    } catch (err){
        json.buildError(err);
    }
};

function getWallet( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (!req.params.walletId){
            throw new Error('ERROR_WALLETS_INVALID_ID_PARAM');
        }
        
        var walletId = parseInt(req.params.walletId);
        
        if (walletId === NaN){
            throw new Error('ERROR_WALLETS_INVALID_ID_PARAM');
        }
        
        walletModel.getWalletById( req.currentUser.user_id, walletId, function(err, list){
            if (err){
                body.buildError(err);
            } else {
                body.build(list);
            }
        });
        
    } catch(err) {
        body.buildError(err);
    }
};

function saveWallet( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        var walletData = {};
        walletData.user_id = req.currentUser.user_id;
        walletData.wallet_id = req.params.walletId || null;
        walletData.wallet_name = req.body.wallet_name || null;
        
        walletData.wallet_id = parseInt(walletData.wallet_id);
        
        if (walletData.wallet_name && walletData.wallet_name.length <= 1){
            throw new Error('ERROR_WALLETS_INVALID_NAME_PARAM');
        }
        
        if (walletData.wallet_id === NaN){
            throw new Error('ERROR_WALLETS_INVALID_ID_PARAM');
        }
        
        walletModel.getWalletById(walletData.user_id, walletData.wallet_id, function(err, data){
            if (err){
                body.buildError(err);
                return;
            }
            
            data.wallet.wallet_name = walletData.wallet_name;
            data.wallet.save(function(err){
                if (err){
                    body.buildError(err);
                } else {
                    body.build({ wallet: data.wallet.export() });
                }
            });
        });
    } catch(err) {
        body.buildError(err);
    }
};

function insertWallet( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        var walletData = {};
        walletData.user_id = req.currentUser.user_id || null;
        walletData.wallet_name = req.body.wallet_name || null;
        
        if (!walletData.user_id){
            throw new Error('ERROR_LISTS_INVALID_USER_PARAM');
        }
        
        if (!walletData.wallet_name || (walletData.wallet_name && walletData.wallet_name.length <= 1)){
            throw new Error('ERROR_LIST_INVALID_NAME_PARAM');
        }
        
        walletModel.insertWallet(walletData, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                body.build(data);
            }
        });
    } catch(err) {
        body.buildError(err);
    }
};

function deleteWallet( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('wallets') == -1){
            throw new Error('FORBIDEN');
        }
        
        var walletId = req.params.walletId || null;
        
        if (!walletId){
            throw new Error('ERROR_WALLETS_INVALID_ID_PARAM');
        }
        
        walletModel.getWalletById( req.currentUser.user_id, walletId, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                data.wallet.delete(function(err){
                    if (err){
                        body.buildError(err);
                    } else {
                        body.build();
                    }
                });
            }
        });
    } catch(err) {
        body.buildError(err);
    }
};

/*
 * Public methods
 */
module.exports = {
    find: findWallets, 
    get: getWallet,
    save: saveWallet,
    insert: insertWallet,
    delete: deleteWallet
};