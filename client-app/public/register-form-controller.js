/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */
var app = angular.module('myWallet');

app.controller('RegisterFormController', [ '$scope', '$cookies', 'UserService', 'SessionsService', 'UiMessagesService', function($scope, $cookies, users, sessions, ui) {
    ui.clear();
    
    $scope.page = {};
    $scope.page.title = 'Cadastro';
    $scope.page.description = 'Descrição';
    
    $scope.formStatus = true;
    
    $scope.data = {
        user_name: null,
        user_email: null,
        user_password: null,
        user_password_2: null
    };
    
    $scope.doRegister = function(){
        $scope.formStatus = false;
        
        var promise = users.insert( $scope.data );
        promise.then(function( data ){
            // success
            $cookies.put('myWalletAuth', data.auth);
            var auth = sessions.auth({ 
                user_email: data.users.user_email,
                user_password: $scope.data.password
            });
            
            auth.then(function( data ){
                window.location.hash = '';
                window.location.reload();
            }, function(err){
                ui.error(err);
                $scope.formStatus = true;
            });
            
        }, function( err ){
            // error
            ui.error(err);
            $scope.formStatus = true;
        });
        
    };

}]);