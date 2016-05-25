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
        items: 0,
        items_per_page: 1
    };
    
    $scope.filters = {};
    
    // private methods
    var _parseError = function(err){
        ui.error(err);
    };
    
    var _parseTransactions = function(response){
        try {
            
            $scope.transactions = response.data.transactions;
            $scope.pagination.items = response.data.pagination.total_records;
            $scope.pagination.items_per_page = response.data.pagination.page_records;
            
            $scope.grid.is_active = true;
            
        } catch (err) {
            ui.error(err);
        }
    };
    
    var _parseSummary = function(response){
        try {
            $scope.summary.credit = response.data.summary.summary_credit;
            $scope.summary.debit = response.data.summary.summary_debit;
            $scope.summary.total = response.data.summary.summary_total;
        } catch(err) {
            ui.error(err);
        }
    };
    
    // Grid actions
    $scope.grid = {};
    $scope.grid.nextPage = function(){};
    $scope.grid.previousPage = function(){};
    $scope.grid.is_active = false;
    $scope.grid.selection = [];
    
    // Load Summary
    $scope.grid.updateSummary = function(){
        transactions.getSummary( $scope.filters ).then(_parseSummary, _parseError);
    };
    
    // Load Grid
    $scope.grid.updateTransactions = function(){
        
        $scope.filters._page = $scope.pagination.page;
        
        // Disable grid
        $scope.grid.is_active = true;
        // Call api
        transactions.getTransactions($scope.filters).then(_parseTransactions, _parseError);
    };
    
    // Shortcuts
    $scope.grid.nextPage = function(){
        if (($scope.pagination.items / $scope.pagination.items_per_page) <= $scope.pagination.page){
            $scope.pagination.page++;
            $scope.grid.updateTransactions();
        }
    };
    $scope.grid.previousPage = function(){
        if ($scope.pagination.page > 0){
            $scope.pagination.page--;
            $scope.grid.updateTransactions();
        }
    };
    $scope.grid.refresh = function(){
        $scope.grid.updateTransactions();
        $scope.grid.updateSummary();
    };
    
    $scope.grid.addTransaction = function( transactionData ){};
    $scope.grid.openTransaction = function( transactionId ){};
    $scope.grid.removeTransaction = function( transactionId ){};
    
    // start grid
    $scope.grid.refresh();
}]);