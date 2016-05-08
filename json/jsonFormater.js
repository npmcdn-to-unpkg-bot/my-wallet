/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 * 
 * Json Formater should padronze the json communications
 */

var response = {
    status: 200,
    message: 'Sucess',
    data: {}
};

var responseBody = {
    json: function(){}
};

module.exports = {
    use: function(res){
        responseBody = res;
    },
    build: function(data, status, message){
        if (typeof data !== 'undefined'){
            response.data = data;
        }
        
        if (typeof status === 'number'){
            response.status = status;
        }
        
        if (typeof message !== 'undefined'){
            response.message = message;
        }
        
        responseBody.json(response);
    }
};
