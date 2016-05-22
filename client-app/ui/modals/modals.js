/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module( 'myWallet.ui' );

app.service('UiModalsService', ['$q', 'SessionsService', '$uibModal', function($q, sessions, $uibModal){
    
    this.addModal = function( modalData ){
        var q = $q.defer();
        
        try{
            
            // TODO
            throw new Error('TODO_ERROR');
            
            
        } catch(err) {
            q.reject(err);
        }
        
        return q;
    };
    
    // Quick alias
    
    this.chioseModal = function( title, message, yesLabel, noLabel ){
        return this.addModal({
            title: 'Sessão expirada',
            message: 'Por favor, informe novamente suas credenciais',
            template: '/app/ui/modals/auth-modal-form-view.html',
            $scope: {
                onSubmit: function( promise, data ){
                    // TODO
                }
            }
        });
    };
    
    this.confirmModal = function( title, message ){
        return this.addModal({
            title: title,
            message: message,
            template: '/app/ui/modals/confirm-modal-view.html',
            $scope: {
                onAccept: function( promise, data ){
                    // TODO
                    promise.resolve(data);
                },
                onReject: function( promise, data ){
                    // TODO
                    promise.reject(data);
                }
            }
        });
    };
    
    // The modals above are compliance with bui modals
    this.passwordModal = function( user ){
        var q = $q.defer();
        
        try{
            $uibModal.open({
                controller: 'UiPasswordModalController',
                templateUrl: '/app/ui/modals/password-modal-form-view.html',
                resolve: {
                    user: function(){ return user; }
                }
            }).result.then(function(user){
                q.resolve(user);
            }, function(err){
                // error
                q.reject(err);
            });
            
        } catch (err) {
            console.log(err.message);
            q.reject(err);
        }
        
        return q.promise;
    };
    
    this.authModal = function( user ){
        var q = $q.defer();
        
        try{
            $uibModal.open({
                controller: 'UiAuthModalController',
                templateUrl: '/app/ui/modals/auth-modal-form-view.html',
                resolve: {
                    user: function(){ return user; }
                }
            }).result.then(function(user){
                q.resolve(user);
            }, function(err){
                // error
                q.reject(new Error('ERROR_AUTHENTICATION_FAILURE'));
                window.location.reload();
            });
            
        } catch (err) {
            console.log(err.message);
            q.reject(err);
        }
        
        return q.promise;
    };
    
}]);
