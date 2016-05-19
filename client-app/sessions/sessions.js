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
            var def = $q.defer();
            
            $http({
                url: '/api/v1/sessions/auth',
                method: 'POST',
                data: userData
            }).then(function(response){
                // Success
                try {
                    if (response.data.error){
                        throw new Error(response.data.error.key);
                    }
                    
                    $cookies.put('myWalletAuth', response.data.auth);
                    
                    def.resolve( response.data.auth );
                } catch (err) {
                    def.reject(err);
                }
            }, function(response){
                // Error
            });
            
            return def.promise;
        };
        
        this.logout = function(){
            $cookies.put('myWalletAuth', '');
            window.location.hash = '';
            window.location.reload();
        };
        
        this.getUser = function(){
            var def = $q.defer();
            
            return def.promise;
        };
}]);
