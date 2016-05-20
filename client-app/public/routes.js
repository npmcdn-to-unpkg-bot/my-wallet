/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet');

// Routes
app.config(function($routeProvider) {
    $routeProvider

    // Default page: Transaction Grid
    .otherwise({
	templateUrl : 'app/public/public-view.html',
	controller : 'PublicController'
    })
    
    .when('/register', {
        templateUrl: 'app/public/register-form-view.html',
        controller: 'RegisterFormController'
    })

    // Single grid
    .when('/login', {
	templateUrl: 'app/public/login-form-view.html',
	controller: 'LoginFormController'
    });
});