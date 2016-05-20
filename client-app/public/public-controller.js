/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');

app.controller('PublicController', ['$scope', function($scope){
        $scope.page = {};
        $scope.page.banners = [
            {
                //title: 'Meu Slide',
                //description: 'Compre isso',
                //href: 'Link para',
                image: '/app/assets/banners/home/wimm.jpg'
            }
        ];
}]);