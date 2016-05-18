/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

'use strict';

// Instance angular app
var app = angular.module('myWallet');

app.directive('uiMessages', function() {
    return {
	restrict : 'E',
	templateUrl : 'app/ui-messages/messages-list.html',
	controller : 'UiMessageController'
    };
});

app.directive('navbarTop', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/navbar/navbar-top.html',
	controller : 'NavbarController'
    };
});

app.directive('sigunButtons', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/public/login-buttons-view.html',
	controller : 'LoginButtonsController'
    };
});