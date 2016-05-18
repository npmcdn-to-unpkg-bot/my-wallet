/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');

app.service('SessionsService', ['$cookies', '$q', '$http', function($cookies, $q, $http){
        
        this.currentUser = null;
        
        this.auth = function( userData ){
            var promisse = $q.defer();
            
            // TODO
            // $cookies.put('myWalletAuth', data.auth);
            
            return promisse;
        };
        
        this.getUser = function(){
            var promisse = $q.defer();
            
            return promisse;
        };
}]);
