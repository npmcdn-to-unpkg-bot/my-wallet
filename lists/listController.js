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
var listModel = require(global.pathTo('/lists/listModel.js'));
var validate = require('validator');

// route functions
function findLists( req, res ){
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
        
        if (req.currentUser.capabilities.indexOf('lists') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (search.find != null && typeof search.find !== 'string'){
            throw new Error('ERROR_LISTS_INVALID_SEARCH_QUERY');
        }
        
        if (!Number.isInteger(search.page)){
            throw new Error('ERROR_LISTS_INVALID_PAGE');
        }
        
        if (!Number.isInteger(search.items)){
            throw new Error('ERROR_LISTS_INVALID_LIST_SIZE');
        };
        
        if (search.sort !== null && typeof search.sort !== 'string'){
            throw new Error('ERROR_LISTS_INVALID_SORT');
        }
        
        search.user_id = req.currentUser.user_id;
        
        listModel.find( search, function( err, lists ){
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

function getLists( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('lists') == -1){
            throw new Error('FORBIDEN');
        }
        
        if (!req.params.listId){
            throw new Error('ERROR_LISTS_INVALID_ID_PARAM');
        }
        
        var listId = parseInt(req.params.listId);
        
        if (listId === NaN){
            throw new Error('ERROR_LISTS_INVALID_ID_PARAM');
        }
        
        listModel.getListById( req.currentUser.user_id, listId, function(err, list){
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

function saveList( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('lists') == -1){
            throw new Error('FORBIDEN');
        }
        
        var listData = {};
        listData.user_id = req.currentUser.user_id;
        listData.list_id = req.params.listId || null;
        listData.list_name = req.body.list_name || null;
        
        listData.list_id = parseInt(listData.list_id);
        
        if (listData.list_name && listData.list_name.length <= 1){
            throw new Error('ERROR_LISTS_INVALID_NAME_PARAM');
        }
        
        if (listData.list_id === NaN){
            throw new Error('ERROR_LISTS_INVALID_ID_PARAM');
        }
        
        listModel.getListById(listData.user_id, listData.list_id, function(err, data){
            if (err){
                body.buildError(err);
                return;
            }
            
            data.list.list_name = listData.list_name;
            data.list.save(function(err){
                if (err){
                    body.buildError(err);
                } else {
                    body.build({ list: data.list.export() });
                }
            });
        });
    } catch(err) {
        body.buildError(err);
    }
};

function insertList( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try{
        
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('lists') == -1){
            throw new Error('FORBIDEN');
        }
        
        var listData = {};
        listData.user_id = req.currentUser.user_id || null;
        listData.list_name = req.body.list_name || null;
        
        if (!listData.user_id){
            throw new Error('ERROR_LISTS_INVALID_USER_PARAM');
        }
        
        if (!listData.list_name || (listData.list_name && listData.list_name.length <= 1)){
            throw new Error('ERROR_LIST_INVALID_NAME_PARAM');
        }
        
        listModel.insertList(listData, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                body.build({ list: data.list });
            }
        });
    } catch(err) {
        body.buildError(err);
    }
};

function deleteList( req, res ){
    var body = jsonBuilder.getBuilder(res);
    
    try {
        if (!req.currentUser){
            throw new Error('UNAUTHORIZED');
        }
        
        if (req.currentUser.capabilities.indexOf('lists') == -1){
            throw new Error('FORBIDEN');
        }
        
        var listId = req.params.listId || null;
        
        if (!listId){
            throw new Error('ERROR_LISTS_INVALID_ID_PARAM');
        }
        
        listModel.getListById( req.currentUser.user_id, listId, function(err, data){
            if (err){
                body.buildError(err);
            } else {
                data.list.delete(function(err){
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
    find: findLists, 
    get: getLists,
    save: saveList,
    insert: insertList,
    delete: deleteList
};