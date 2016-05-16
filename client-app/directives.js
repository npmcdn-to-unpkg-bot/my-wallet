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
	templateUrl : 'app/common/ui-messages/messages-list.html',
	controller : 'UiMessageController'
    };
});

app.directive('navbarTop', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/common/navbar/navbar-top.html',
	controller : 'NavbarController'
    };
});

app.directive('sigunButtons', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/common/login/signup-buttons.html',
	controller : 'SiginupButtonController'
    };
});

app.directive('registerForm', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/common/login/register-form.html',
	controller : 'RegisterFormController'
    };
});

app.directive('loginForm', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/common/login/login-form.html',
	controller : 'LoginFormController'
    };
});