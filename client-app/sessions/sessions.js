/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.sessions', ['ngCookies']);

app.service('SessionsService', ['$cookies', '$q', '$http', function($cookies, $q, $http){
        
        var _parseError = function( promise, response ){
            if (response instanceof Error){
                promise.reject(response);
            } else if (response.data && response.data.error) {
                promise.reject(new Error(response.data.error.key));
            } else {
                promise.reject(new Error('ERROR_CONNECTION_FAILURE'));
            }
        };
        
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
                    _parseError( def , err );
                }
            }, function(response){
                // Error
                _parseError( def, response );
            });
            
            return def.promise;
        };
        
        this.logout = function(){
            $cookies.put('myWalletAuth', null);
            window.location.hash = '';
            window.location.reload();
        };
        
}]);
