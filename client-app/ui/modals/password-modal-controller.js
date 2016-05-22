/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.ui');

app.controller('UiPasswordModalController', [ '$scope', '$uibModalInstance', 'UsersService', 'user', function($scope, modal, users, user){
    
    $scope.page = {};
    $scope.page.title = 'Alterar sua senha!';
    $scope.page.description = 'Informe primeiro sua senha atual, e então a nova senha.';
    
    $scope.formStatus = true;
    $scope.formPasswordField = 'password';
    
    $scope.data = {
        user_email: user.user_email,
        user_current_password: null,
        user_new_password: null
    };
    
    $scope.changePasswordField = function(){
        if ($scope.formPasswordField === 'password'){
            $scope.formPasswordField = 'text';
        } else {
            $scope.formPasswordField = 'password';
        }
    };
    
    $scope.doChangePassword = function(){
        $scope.formStatus = false;
        
        users.changePassword( $scope.data ).then(function(user){
            // success
            alert('USERS_PASSWORD_CHANGED');
            modal.close(user);
            $scope.formStatus = true;
        }, function(err){
            // error
            alert(err.message);
            $scope.formStatus = true;
        });
        
    };
    
}]);