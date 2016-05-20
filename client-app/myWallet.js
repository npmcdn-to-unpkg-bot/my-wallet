/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

'use strict';

// Instance angular app
var app = angular.module('myWallet', [ 'ngRoute', 'ngCookies', 'ui.bootstrap' ]);

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