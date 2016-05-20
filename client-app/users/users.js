/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');

app.service('UsersService', ['ApiService', '$q', 'SessionsService', 'ApiService', function(api, $q, sessions, api){
    // TODO
    this.currentUser = null;
    
    this.getUser = function(){
        var def = $q.defer();

        try {

            if (this.currentUser){
                def.resolve(this.currentUser);
            } else {
                api.get('/users/details').then(function(response){
                    // success
                    if (response.data && response.data.user){
                        def.resolve(response.data.user);
                    } else {
                        def.reject(new Error(response.data.error.key));
                    }
                }, function(response){
                    // error
                    def.reject(response);
                });
            }

        } catch(err) {
            def.reject(err);
        }

        return def.promise;
    };
    
    this.insert = function(data){
        var deferred = $q.defer();
        
        try{
            
            /*
             * data.user_name: (string)
             * data.user_email: (email)
             * data.user_password: (pass)
             * data.user_password_2: (pass)
             */
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.user_email)){
                throw new Error('ERROR_USERS_INVALID_EMAIL');
            }
            
            if (!(data.user_name && data.user_name.length > 0)){
                throw new Error('ERROR_USERS_INVALID_NAME');
            }
            
            if (!(data.password && data.password == data.password_2)){
                throw new Error('ERROR_USERS_INVALID_PASSWORD');
            }
            
            // Add new user
            $http({
                url: '/api/v1/users',
                method: 'POST',
                data: data
            }).then(function(response){
                // success
                deferred.resolve( response.data );

            }, function(response){
                // error
                deferred.reject( new Error(response.data.error.key) );
            });
            
        } catch(err) {
            deferred.reject(err);
        }
        
        return deferred.promise;
    };
}]);