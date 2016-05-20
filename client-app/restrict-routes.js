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
	templateUrl : '/app/transactions/transactions-grid-view.html',
	controller : 'TransactionsGridController'
    })
    
    .when('/transactions/transactionId', {
        templateUrl: '/app/transactions/transaction-view.html',
        controller: 'TransactionController'
    })

    // Single grid
    .when('/lists', {
	templateUrl: '/app/lists/list-grid-view.html',
	controller: 'ListGridController'
    })
    
    // Single list
    .when('/lists/:listId', {
	templateUrl : '/app/lists/list-view.html',
	controller : 'ListController'
    })

    // Wallet grid
    .when('/wallets', {
	templateUrl : '/app/wallets/wallet-grid-view.html',
	controller : 'WalletGridController'
    })

    // Wallet single
    .when('/wallets/:walletId', {
	templateUrl : '/app/wallets/wallet-view.html',
	controller : 'WalletController'
    })

    // Accounts
    .when('/account', {
	templateUrl: '/app/accounts/account-view.html',
	controller: 'AccountController'
    });

});