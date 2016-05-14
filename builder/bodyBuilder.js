/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Json Formater should padronze the json communications
 */

var messageEnum = require(global.pathTo('/messages/messageEnum.js'));

/**
 * JsonFormater
 * An json parser to create standarized json comunication objects
 * 
 * @param {response} res Express response object
 */
var JsonBuilder = function( res ){
    if (res){
        this.use(res);
    }
    
    this.sent = false;
};

/**
 * JsonFormater.use
 * Add or change an response object that JsonFormater will use to build the response body
 * 
 * @param {response} res The Express response object reference
 * @returns {undefined}
 */
JsonBuilder.prototype.use = function( res ){
    this.res = res;
    return this;
};

/**
 * JsonFormater.build
 * Creant a standarized json object with status, message and data structure
 * 
 * @param {object} data (optional) An json abstract object (only the data object)
 * @param {number} statusCode (optional) An valid HTTP status code
 * @param {string} statusMessage An string with a user message
 * @return {undefined}
 */
JsonBuilder.prototype.build = function( data, statusCode ){
    
    // Replace data
    if (typeof data === 'undefined' ){
        data = {};
    }
    
    if (typeof data === 'number'){
        statusCode = data;
        data = {};
    }
    
    if (typeof statusCode === 'undefined'){
        statusCode = 200;
    }
    
    if (typeof data.error === 'undefined'){
        data.error = false;
    }
    
    if (this.sent == false){
        this.res.status(statusCode).json(data);
    } else {
        console.log('[ERROR] Try to render same request twice');
    }
    
    this.sent = true;
};

/**
 * JsonFormater.buildError
 * Create an standarized Error object communication
 * 
 * @param {Error} err An error object
 *  There are two types os error messages:
 *      First: An traditional ennumeration message like new Error('ERROR_ENUM') that will be translated to an user text;
 *      Second: An contactened error enum like new Error('404: ERROR_ENUM') that will be translated to users message and will change the HTTP status code
 * @return {undefined}
 */
JsonBuilder.prototype.buildError = function( err ){
    /*
     * {
     *     key: 'ERROR_API_ROUTE_NOT_FOUND',
     *     message: "Rota não encontrada"
     * }
     */
    var errorBody = messageEnum.get( err.message );
    this.build( {error: errorBody}, errorBody.code);
};

module.exports = {
    getBuilder: function(res){
        return new JsonBuilder(res);
    }
};