/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

'use strict';

// Instance angular app
var app = angular.module('myWallet', 
    [ 
        'ngRoute',
        'myWallet.api',
        'myWallet.sessions',
        'myWallet.ui',
        'myWallet.users'
    ]);

/**
 * Clear Unpleasury template cache
 */
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
	if (typeof (current) !== 'undefined') {
	    $templateCache.remove(current.templateUrl);
	}
    });
});

app.directive('sigunButtons', function() {
    return {
	restrict : 'EA',
	templateUrl : 'app/public/login-buttons-view.html',
	controller : 'LoginButtonsController'
    };
});