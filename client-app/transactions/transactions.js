/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.transactions', ['myWallet.api', 'myWallet.ui']);

app.service('TransactionsService', ['ApiService', '$q', function( api, $q ){
    
    this.getTransactions = function(){
        var q = $q.defer();
        
        api.get('/transactions').then(function(response){
            // success
            q.resolve(response);
        }, function(err){
            // Error
            q.reject(err);
        });
        
        return q.promise;
    };
    
}]);