/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.ui');

app.controller('UiController', ['$scope', 'UsersService', 'UiModalsService', 'SessionsService', function($scope, users, uiModals, sessions){
    
    var _onFail = function(response){
        //window.location.reload();
        console.log('Deu ruim', response);
    };
    
    var _checkLoad = function(){
        if ($scope.user !== null){
            $scope.loadStatus = true;
        }
    };
    
    // Page attributes
    $scope.page = {
        title: 'Wimm'
    };
    
    $scope.loadStatus = false;
    
    $scope.user = null;
    
    $scope.logout = function(){
        sessions.logout();
    };
    
    $scope.openPasswordModal = function(){
        uiModals.passwordModal( $scope.user ).then(
        
        );
    };
    
    // Loading Dependences
    users.getUser().then(function(user){
        $scope.user = user;
        _checkLoad();
    }, _onFail);
    
}]);