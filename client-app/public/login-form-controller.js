/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */
var app = angular.module('myWallet');

app.controller('LoginFormController', [ '$scope', 'SessionsService', 'UiMessagesService', function($scope, sessions, ui) {
    ui.clear();
    
    $scope.page = {};
    $scope.page.title = 'Acessar sua carteira';
    $scope.page.description = 'Informe seus dados de acesso';
    
    $scope.formStatus = true;
    
    $scope.data = {
        user_email: null,
        password: null
    };
    
    $scope.doLogin = function(){
        $scope.formStatus = false;
        
        var promise = sessions.auth( $scope.data );
        promise.then(function( data ){
            // success
            window.location.hash = '';
            window.location.reload();
        }, function( err ){
            // error
            $scope.formStatus = true;
            ui.error(err);
        });
        
    };

}]);