/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet', [ 'ngRoute' ]);

// Routes
app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .otherwise({
	// templateUrl : 'client-app/dashboard/dashboardView.html',
	controller : 'DashboardController'
    })

    // Html email creator
    .when('/html-emails', {
	templateUrl : 'client-app/html-emails/html-email-view.html',
	controller : 'HtmlEmailController'
    })

    // Desistentes
    .when('/desistentes', {
	templateUrl : 'client-app/relationship/relationship-view.html',
	controller : 'RelationshipController'
    })

    // Desistentes
    .when('/normalizer', {
	templateUrl : 'client-app/normalizer/normalizer-view.html',
	controller : 'NormalizerController'
    })

    // Desistentes
    .when('/aweber', {
	templateUrl : 'client-app/aweber/aweber-view.html',
	controller : 'AweberController'
    })

    // Html email creator
    .when('/research', {
	// templateUrl : 'client-app/research/researchView.html',
	controller : 'ResearchController'
    });

});