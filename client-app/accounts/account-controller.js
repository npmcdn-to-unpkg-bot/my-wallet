/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.accounts');

app.controller('AccountController', ['$scope', 'ApiService', 'UsersService', 'UiMessagesService', function( $scope, api, users, ui ){
    
    // User
    $scope.user = {
        user_name: null,
        user_email: null
    };
    
    // page attributes
    $scope.page = {
        title: 'Minha conta',
        description: 'Alterar informações pessoais',
        breadcrumb: [
            { url: '#/', label: 'Wimm' },
            { label: $scope.user.user_name }
        ]
    };
    
    // Save form
    $scope.saveFormStatus = true;
    $scope.saveUser = function(){
        $scope.saveFormStatus = false;
        users.save( $scope.user ).then(function(user){
            $scope.saveFormStatus = true;
            $scope.user = user;
            ui.success('USERS_SAVED_DATA');
        }, function(err){
            $scope.saveFormStatus = true;
            // Error
            ui.error(err);
        });
    };
    
    // Load information
    $scope.loaded = false;
    
    var _checkLoad = function(){
        if ($scope.user != null){
            $scope.loaded = true;
        }
    };
    
    users.getUser().then(function(user){
        // success
        $scope.user = user;
        _checkLoad();
    }, function(err){
        // error
        ui.error(err);
    });
    
}]);
