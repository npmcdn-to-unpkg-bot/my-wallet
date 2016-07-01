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
        items_per_page: 1,
        getPages: function(){
            var pages = [];
            
            for(var x=0; x<(this.items/this.items_per_page); x++){
                pages.push({
                    index: x,
                    label: (x+1)
                });
            }
            
            return pages;
        }
    };
    
    $scope.filters = {};
    
    // private methods
    var _parseError = function(err){
        ui.error(err);
        $scope.actionbar.btnRefresh = true;
    };
    
    var _parseTransactions = function(response){
        try {
            
            $scope.transactions = response.data.transactions;
            $scope.pagination.items = response.data.pagination.total_records;
            $scope.pagination.items_per_page = response.data.pagination.page_records;
            
            $scope.grid.is_active = true;
            $scope.actionbar.btnRefresh = true;
            
            ui.success('TRANSACTIONS_UPDATE_SUCCESS');
            
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
    $scope.grid.is_active = false;
    $scope.grid.selection = {};
    $scope.grid.getSelected = function(){
        var selected = [];
        for( var x in $scope.grid.selection){
            if ($scope.grid.selection[x]){
                selected.push(x);
            }
        }
        return selected;
    };
    $scope.grid.isSelected = function( index ){
        var list = $scope.grid.getSelected();
        return (list.indexOf( index ) > -1);
    };
    
    // Load Summary
    $scope.grid.updateSummary = function(){
        transactions.getSummary( $scope.filters ).then(_parseSummary, _parseError);
    };
    
    // Load Grid
    $scope.grid.updateTransactions = function(){
        
        $scope.filters._page = $scope.pagination.page;
        
        // Disable grid
        $scope.grid.is_active = false;
        // Call api
        transactions.getTransactions($scope.filters).then(_parseTransactions, _parseError);
    };
    
    // Shortcuts
    $scope.grid.nextPage = function(){
        ui.clear();
        if (($scope.pagination.items / $scope.pagination.items_per_page) >= $scope.pagination.page){
            $scope.pagination.page++;
            $scope.grid.updateTransactions();
        }
    };
    $scope.grid.previousPage = function(){
        ui.clear();
        if ($scope.pagination.page > 0){
            $scope.pagination.page--;
            $scope.grid.updateTransactions();
        }
    };
    
    $scope.grid.goToPage = function(index){
        ui.clear();
        $scope.pagination.page = index;
        $scope.grid.updateTransactions();
    };
    
    $scope.actionbar = {
        btnNewTransaction: true,
        btnNewWallet: true,
        btnNewList: true,
        btnEdit: true,
        btnDelete: true,
        btnRefresh: true
    };
    $scope.actionbar.refresh = function(clear){
        $scope.actionbar.btnRefresh = false;
        //ui.clear();
        $scope.grid.updateTransactions();
        $scope.grid.updateSummary();
    };
    $scope.actionbar.addTransaction = function(){};
    $scope.actionbar.addWallet = function(){};
    $scope.actionbar.addList = function(){};
    $scope.actionbar.openTransaction = function( transactionId ){};
    $scope.actionbar.removeTransaction = function(){
        var transactionList = $scope.grid.getSelected();
        
        $scope.actionbar.btnDelete = false;
        
        try{
            if (transactionList.length == 0){
                throw new Error('TRANSACTION_GRID_YOU_SHALL_SELECT_AT_LAST_ONE');
            }
            
            transactions.delete( transactionList ).then(function(response){
                // success
                $scope.actionbar.btnDelete = true;
                $scope.actionbar.refresh();
            }, function(err){
                // error
                ui.error(err);
                $scope.actionbar.btnDelete = true;
            });
            
        } catch (err) {
            ui.error(err);
            $scope.actionbar.btnDelete = true;
        }
        
    };
    
    // start grid
    $scope.actionbar.refresh();
}]);