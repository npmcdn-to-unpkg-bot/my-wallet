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
	templateUrl : 'client-app/transactions/transaction-grid-view.html',
	controller : 'TransactionGridController'
    })
    
    .when('/transactions/transactionId', {
        templateUrl: 'client-app/transactions/transaction-view.html',
        controller: 'TransactionController'
    })

    // Single grid
    .when('/lists', {
	templateUrl: 'client-app/lists/list-grid-view.html',
	controller: 'ListGridController'
    })
    
    // Single list
    .when('/lists/:listId', {
	templateUrl : 'client-app/lists/list-view.html',
	controller : 'ListController'
    })

    // Wallet grid
    .when('/wallets', {
	templateUrl : 'client-app/wallets/wallet-grid-view.html',
	controller : 'WalletGridController'
    })

    // Wallet single
    .when('/wallets/:walletId', {
	templateUrl : 'client-app/wallets/wallet-view.html',
	controller : 'WalletController'
    })

    // Accounts
    .when('/account', {
	templateUrl : 'client-app/accounts/account-view.html',
	controller : 'AccountController'
    })

});