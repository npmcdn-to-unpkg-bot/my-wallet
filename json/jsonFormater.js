/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Json Formater should padronze the json communications
 */

var responseBody = {
    json: function(){}
};

var ERROR = {
    ERROR_API_ROUTE_NOT_FOUND: "Rota não encontrada"
};

ERROR.prototype.get = function( eNum ){
    if (typeof this[eNum] !== 'undefined'){
        return this[eNum];
    } else {
        return eNum;
    }
};

ERROR.prototype.parser = function( err ){
    var errorReg = /(?:([\d]+):\s+)?([\w]+)/;
    var parsed = errorReg.exec( err.message );
    
    if (parsed.length == 2) {
        return {
            key: parsed[1],
            code: 500,
            message: this.get(parsed[1])
        };
    } else {
        return {
            key: parsed[2],
            code: parsed[1],
            message: parsed[2]
        };
    }
};
ERROR.prototype.key = function( err ){
    return this.parser(err).key;
};
ERROR.prototype.code = function( err ){
    return this.parser(err).code;
};
ERROR.prototype.build = function( err ){
    return this.parser(err);
};

module.exports = {
    use: function(res){
        responseBody = res;
        return this;
    },
    build: function(data, status, message){
        
        var res = {
            status: 200,
            message: 'Sucess',
            data: {}
        };
        
        if (typeof data !== 'undefined'){
            res.data = data;
        }
        
        if (typeof status === 'number'){
            res.status = status;
        }
        
        if (typeof message !== 'undefined'){
            res.message = message;
        } else {
            if (res.status > 200 && typeof res.data.message !== 'undefined'){
                res.message = res.data.message;
            }
        }
        
        responseBody.status(res.status);
        responseBody.json(res);
    },
    buildError: function(err){
        /*
         * {
         *     key: 'ERROR_API_ROUTE_NOT_FOUND',
         *     message: "Rota não encontrada"
         * }
         */
        
        this.build(ERROR.build(err), ERROR.code(err));
    }
};
