/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module( 'myWallet.ui', ['ui.bootstrap', 'myWallet.sessions', 'myWallet.users']);

// UI Directives
app.directive('pageHeader', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/ui/templates/page-header.html'
    };
});

app.directive('uiMessages', function() {
    return {
	restrict : 'E',
	templateUrl : 'app/ui/messages/messages-list.html',
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