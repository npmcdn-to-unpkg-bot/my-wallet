/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.accounts');

app.controller('AccountController', ['$scope', 'ApiService', 'UsersService', 'UiMessagesService', function( $scope, api, users, ui ){
    
    // page attributes
    $scope.page = {
        title: 'Minha conta',
        description: 'Alterar informações pessoais',
        breadcrumb: [
            { url: '#/', label: 'Wimm' },
            { label: $scope.user.user_name }
        ]
    };
    
    // User
    $scope.user = null
            
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
