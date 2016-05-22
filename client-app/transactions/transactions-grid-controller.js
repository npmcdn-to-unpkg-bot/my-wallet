/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.transactions');

app.controller('TransactionsGridController', ['$scope', 'TransactionsService', 'UiMessagesService', function($scope, transactions, ui){
    
    // Page info
    $scope.page = {
        title: 'Minhas transações',
        description: 'Lista das minhas transações'
    };
    
    $scope.transactions = [];
    
    $scope.summary = {
        credit: 0,
        debit: 0,
        total: 0
    };
    
    $scope.pagination = {
        page: 0,
        items: 0
    };
    
    // Grid actions
    $scope.grid = {};
    $scope.grid.nextPage = function(){};
    $scope.grid.previousPage = function(){};
    $scope.grid.is_active = false;
    $scope.grid.selection = [];
    
    // Load Grid
    transactions.getTransactions().then(function(response){
        try {
            
            if (response.data.error){
                throw new Error(response.data.error.key);
            }
            
            $scope.transactions = response.data.transactions;
            $scope.summary.total = response.data.summary.summary_total;
            $scope.summary.credit = response.data.summary.summary_credit;
            $scope.summary.debit = response.data.summary.summary_debit;
            $scope.pagination.page = response.data.pagination.page;
            $scope.pagination.items = response.data.pagination.items;
            
            $scope.grid.is_active = true;
            
        } catch (err) {
            ui.error(err);
        }
    }, function(err){
        // err
        ui.error(err);
    });
    
}]);