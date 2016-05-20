/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');

app.controller('UiPasswordModalController', [ '$scope', '$uibModalInstance', 'SessionsService', 'user', function($scope, $uibModalInstance, sessions, user){
    
    $scope.page = {};
    $scope.page.title = 'Sessão expirada!';
    $scope.page.description = 'Informe novamente sua senha';
    
    $scope.formStatus = true;
    
    $scope.data = {
        user_email: user.user_email,
        password: null
    };
    
    $scope.doLogin = function(){
        $scope.formStatus = false;
        
        var promise = sessions.auth( $scope.data );
        promise.then(function( data ){
            // success
            $scope.formStatus = true;
            $uibModalInstance.close(data.user);
        }, function( err ){
            // error
            $scope.formStatus = true;
            alert(err.message);
        });
        
    };
    
}]);