/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');
app.controller('LoginButtonsController', ['$scope', function( $scope ){
        $scope.page = {};
        $scope.page.buttons = [
            { url: '#register', label: 'Exprimente agora mesmo', is_primary: false },
            { url: '#login', label: 'Acessar', is_primary: true }
        ];
}]);