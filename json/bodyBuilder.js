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
 * Status Enum
 */
var STATUS = {
    SUCCESS: 200, //OK - Response to a successful GET, PUT, PATCH or DELETE. Can also be used for a POST that doesn't result in a creation.
    CREATED: 201, //201 Created - Response to a POST that results in a creation. Should be combined with a Location header pointing to the location of the new resource
    NO_CONTENT: 204, // No Content - Response to a successful request that won't be returning a body (like a DELETE request)
    NOT_MODIFIED: 304, // Not Modified - Used when HTTP caching headers are in play
    BAD_REQUEST: 400, // Bad Request - The request is malformed, such as if the body does not parse
    UNAUTHORIZED: 401, // Unauthorized - When no or invalid authentication details are provided. Also useful to trigger an auth popup if the API is used from a browser
    FORBIDEN: 403, // Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
    NOT_FOUND: 404, // Not Found - When a non-existent resource is requested
    METHOD_NOT_ALLOWED: 405, // Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
    GONE: 410, // Gone - Indicates that the resource at this end point is no longer available. Useful as a blanket response for old API versions
    UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported Media Type - If incorrect content type was provided as part of the request
    UNPROCESSABLE_ENTITY: 422, // Unprocessable Entity - Used for validation errors
    TOO_MANY_REQUESTS: 429 // Too Many Requests - When a request is rejected due to rate limiting
};

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
JsonBuilder.prototype.build = function( data, statusCode, statusMessage ){
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
JsonBuilder.prototype.buildError = function( err ){
    /*
     * {
     *     key: 'ERROR_API_ROUTE_NOT_FOUND',
     *     message: "Rota não encontrada"
     * }
     */

    this.build(ERROR.build(err), ERROR.code(err));
};

module.exports = {
    getBuilder: function(res){
        return new JsonBuilder(res);
    },
    errorEnum: ERROR,
    statusEnum: STATUS
};