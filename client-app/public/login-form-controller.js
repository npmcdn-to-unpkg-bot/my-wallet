/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */
var app = angular.module('myWallet');

app.controller('LoginFormController', [ '$scope', '$cookies', 'SessionService', 'UiMessagesService', function($scope, $cookies, sessions, ui) {
    ui.clear();
    
    $scope.page = {};
    $scope.page.title = 'Cadastro';
    
    $scope.formStatus = true;
    
    $scope.data = {
        user_email: null,
        user_password: null
    };
    
    $scope.doLogin = function(){
        $scope.formStatus = false;
        
        var promise = sessions.auth( $scope.data );
        promise.then(function( data ){
            // success
            $cookies.put('myWalletAuth', data.auth);
            window.location.hash = '';
            window.location.reload();
        }, function( err ){
            // error
            ui.error(err);
            $scope.formStatus = true;
        });
        
    };

}]);