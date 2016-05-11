/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Json Formater should padronze the json communications
 */

var ErrorEnum = function(){};
ErrorEnum.prototype.get = function( eNum ){
    if (typeof this[eNum] !== 'undefined'){
        return this[eNum];
    } else {
        return eNum;
    }
};

ErrorEnum.prototype.parser = function( err ){
    // test
    //err.message = '500: '+err.message;
    var errorReg = /(?:([\d]+)\:\s+)?([\w]+)/;
    var parsed = errorReg.exec( err.message );
    var body = {
        key: parsed[2],
        message: this.get(parsed[2])
    }
    
    if (typeof parsed[1] == 'undefined'){
        body.code = 500;
    } else {
        body.code = parsed[1];
    }
    
    return body;
};
ErrorEnum.prototype.key = function( err ){
    return this.parser(err).key;
};
ErrorEnum.prototype.code = function( err ){
    return this.parser(err).code;
};
ErrorEnum.prototype.build = function( err ){
    return this.parser(err);
};

var ERROR = new ErrorEnum();

// Add Ennumerations
ERROR.ERROR_API_ROUTE_NOT_FOUND = "Rota não encontrada";

/**
 * JsonFormater
 * An json parser to create standarized json comunication objects
 * 
 * @param {response} res Express response object
 */
var JsonFormater = function( res ){
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
JsonFormater.prototype.use = function( res ){
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
JsonFormater.prototype.build = function( data, statusCode, statusMessage ){
    var responseBody = {
        status: 200,
        message: 'Success',
        data: {}
    };
    
    if (typeof data !== 'undefined'){
        responseBody.data = data;
    }
    
    if (typeof statusCode === 'number'){
        responseBody.status = statusCode;
    }
        
    if (typeof statusMessage !== 'string'){
        responseBody.message = statusMessage;
    } else {
        if (responseBody.status > 200 && typeof responseBody.data.message !== 'undefined'){
            responseBody.message = responseBody.data.message;
        }
    }
    
    if (this.sent == false){
        this.res.status(responseBody.status);
        this.res.json(responseBody);
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
JsonFormater.prototype.buildError = function( err ){
    /*
     * {
     *     key: 'ERROR_API_ROUTE_NOT_FOUND',
     *     message: "Rota não encontrada"
     * }
     */

    this.build(ERROR.build(err), ERROR.code(err));
};

module.exports = JsonFormater;