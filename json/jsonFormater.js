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
    }
};
