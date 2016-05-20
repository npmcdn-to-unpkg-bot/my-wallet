/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.users', ['myWallet.api', 'myWallet.sessions']);

app.service('UsersService', ['ApiService', '$q', 'SessionsService', function(api, $q, sessions){
    
    var _validate = {};
    _validate.isEmail = function( str ){
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
    };
    
    var _self = this;
    
    this.currentUser = null;
    
    this.save = function( userData ){
        var q = $q.defer();
        
        try {
            
            if (!userData){
                throw new Error('ERROR_USERS_EMPTY_USER_DATA');
            }
            
            if (!_validate.isEmail(userData.user_email)){
                throw new Error('ERROR_USERS_INVALID_EMAIL');
            }
            
            if (!(userData.user_name && userData.user_name.length > 1)){
                throw new Error('ERROR_USERS_INVALID_NAME');
            }
            
            api.post('/users/' + this.currentUser.user_id, userData).then(function(user){
                _self.currentUser = user;
                q.resolve(user);
            }, function(err){
                q.reject(err);
            });
            
        } catch (err) {
            q.reject(err);
        }
        
        return q.promise;
    };
    
    this.getUser = function(){
        var def = $q.defer();

        try {

            if (this.currentUser){
                def.resolve(this.currentUser);
            } else {
                api.get('/users/details').then(function(response){
                    // success
                    if (response.data && response.data.user){
                        _self.currentUser = response.data.user;
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
            if (!_validate.isEmail(data.user_email)){
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