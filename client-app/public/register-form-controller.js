/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */
var app = angular.module('myWallet');

app.controller('RegisterFormController', [ '$scope', '$cookies', 'UsersService', 'SessionsService', 'UiMessagesService', function($scope, $cookies, users, sessions, ui) {
    
    $scope.page = {};
    $scope.page.title = 'Cadastro';
    $scope.page.description = 'Precisamos desses dados para proteger suas informações';
    
    $scope.formStatus = true;
    $scope.formPasswordField = 'password';
    
    $scope.data = {
        user_name: null,
        user_email: null,
        password: null,
        password_2: null
    };
    
    $scope.changePasswordField = function(){
        if ($scope.formPasswordField === 'password'){
            $scope.formPasswordField = 'text';
        } else {
            $scope.formPasswordField = 'password';
        }
    };
    
    $scope.doRegister = function(){
        ui.clear();
        
        $scope.formStatus = false;
        
        var promise = users.insert( $scope.data );
        promise.then(function( data ){
            // success
            if (data.error){
                $scope.formStatus = true;
                ui.error(new Error(data.error.key));
                return;
            }
            
            var auth = sessions.auth({ 
                user_email: data.user.user_email,
                password: $scope.data.password
            });
            
            auth.then(function( data ){
                window.location.hash = '';
                window.location.reload();
            }, function(err){
                $scope.formStatus = true;
                ui.error(err);
            });
            
        }, function( err ){
            // error
            $scope.formStatus = true;
            ui.error(err);
        });
        
    };

}]);