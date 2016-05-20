/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.api', ['ngCookies', 'myWallet.ui']);

app.service('ApiService', ['$http', '$cookies', '$q', 'UiModalsService', function($http, $cookies, $q, uiModals){
    
    var currentSession = $cookies.get('myWalletAuth');
    
    var _doRequest = function( promise, httpReq ){
        $http(httpReq).then(function(response){
                // success
                _onSuccess( promise, response );
            }, function(response){
                // error
                _onError( promise, response, httpReq );
            });
    };
    
    var _onSuccess = function( promise, response ){
        promise.resolve( response );
    };
    
    var _onFail = function( promise, response, httpReq ){
        try{
            // Auth Error
            if (response.status == 401){
                // Maybe session expired
                uiModals.authModal().then(function(data){
                    // Success
                    // Try request again
                    _doRequest( promise, httpReq );
                }, function(data){
                    // Error
                    promise.reject(new Error('ERROR_SESSIONS_UNAUTHORIZED'));
                });
            
            // API controlled errors
            } else if (typeof response.data !== 'undefined' && response.data.error){
                throw new Error(response.data.error.key);
            } else {
                throw new Error('ERROR_CONNECTION_FAILURE');
            }
            
        } catch (err) {
            promise.reject(err);
        }
    };
    
    this.connect = function( method, uri, data ){
        var def = $q.defer();
        
        try {
            
            // Validate session cookie
            if (!currentSession){
                throw new Error('ERROR_SESSION_EXPIRED');
            }
            
            // Valitade inputs
            if (!(method && (method == 'POST' || method == 'GET'))){
                throw new Error('ERROR_API_INVALID_METHOD');
            }
            
            if (!uri){
                throw new Error('ERROR_API_INVALID_URI');
            }
            
            if (!data){
                data = {};
            }
            
            // do Http
            var httpReq = {
                url: '/api/v1' + uri,
                mathod: method,
                data: data,
                headers: { 'x-access-token': currentSession }
            };
            
            _doRequest( def, httpReq );
            
        } catch (err) {
            def.reject(err);
        }
        
        return def.promise;
    };
    
    this.post = function(uri, data){
        return this.connect('POST', uri, data);
    };
    
    this.get = function(uri, data){
        return this.connect('GET', uri, data);
    };
}]);