/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.wallets', ['myWallet.api', 'myWallet.ui']);

app.service('WalletsService', ['ApiService', '$q', function( api, $q ){
    
    this.getWallets = function( filters ){
        var q = $q.defer();
        
        var data = {};
        
        if (filters){
            for (var x in filters){
                data[x] = filters[x];
            }
        }
        
        api.get('/transactions', data).then(function(response){
            // success
            q.resolve(response);
        }, function(err){
            // Error
            q.reject(err);
        });
        
        return q.promise;
    };
    
    this.getWalletById = function( filters ){
        var q = $q.defer();
        
        var data = {};
        
        if (filters){
            for (var x in filters){
                data[x] = filters[x];
            }
        }
        
        api.get('/wallets', data).then(function(response){
            // success
            q.resolve(response);
        }, function(err){
            // Error
            q.reject(err);
        });
        
        return q.promise;
    };
    
    this.delete = function( transactions ){
        var q = $q.defer();
        
        var _onFail = function(err){
            q.reject(err);
        };
        
        var _checkQueue = function( id ){
            transactions.splice(transactions.indexOf( id ), 1);
            
            if (transactions.length == 0){
                q.resolve();
            }
        };
        
        if (!transactions instanceof Array){
            transactions = [transactions];
        }
        
        for(var x in transactions){
            api.post('/transactions/'+transactions[x]+'/delete').then(function(response){
                try{
                    _checkQueue(response.data.transaction_id);
                } catch (err) {
                    _onFail(err);
                }
            }, _onFail);
        }
        
        return q.promise;
    };
    
}]);