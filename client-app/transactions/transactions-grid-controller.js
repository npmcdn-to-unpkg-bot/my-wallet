/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.transactions');

app.controller('TransactionsGridController', ['$scope', '$q', 'TransactionsService', 'UiMessagesService', 'UiModalsService', function($scope, $q, transactions, ui, modals){
    
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
        var q = $q.defer();
        
        transactions.getSummary( $scope.filters ).then(function(response){
            _parseSummary(response);
            q.resolve(true);
        }, function(err){
            q.reject(err);
        });
        
        return q.promise;
    };
    
    // Load Grid
    $scope.grid.updateTransactions = function(){
        var q = $q.defer();
        
        $scope.filters._page = $scope.pagination.page;
        
        // Disable grid
        $scope.grid.is_active = false;
        // Call api
        transactions.getTransactions($scope.filters).then(function(response){
            _parseTransactions(response);
            q.resolve(true);
        }, function(err){
            q.reject(err);
            $scope.grid.is_active = true;
        });
        
        return q.promise;
    };
    
    // Grid update
    $scope.grid.update = function(){
        var q = $q.defer();
        var status = {
            summary: false,
            transactions: false,
            check: function(){
                if (this.summary && this.transactions){
                    q.resolve(true);
                }
            },
            fail: function(err){
                q.reject(err);
            }
        };
        
        $scope.grid.updateSummary().then(function(response){
            status.summary = true;
            status.check();
        }, status.fail);
        $scope.grid.updateTransactions().then(function(response){
            status.transactions = true;
            status.check();
        }, status.fail);
        
        return q.promise;
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
        ui.clear();
        $scope.grid.update().then(function(response){
            $scope.actionbar.btnRefresh = true;
            ui.success('TRANSACTIONS_UPDATE_SUCCESS');
        }, function(err){
            $scope.actionbar.btnRefresh = true;
        });
    };
    
    $scope.actionbar.addTransaction = function(){
        var promise = modals.addModal({
            controller: 'TransactionsSingleModalController',
            template: '/app/transactions/transaction-single-modal-form-view.html',
            data: { transaction: null }
        });
        
        promise.then(function(){
            $scope.grid.update();
            ui.success("TRANSACTIONS_ADD_SUCCESS");
        }, _parseError);
    };
    
    $scope.actionbar.addWallet = function(){
        var promise = modals.addModal({
            controller: 'WalletsSingleModalController',
            template: '/app/Wallets/wallet-single-modal-form-view.html',
            data: { wallet: null }
        });
        
        promise.then(function(){
            $scope.grid.update();
            ui.success("WALLETS_ADD_SUCCESS");
        }, _parseError);
    };
    
    $scope.actionbar.addList = function(){
        var promise = modals.addModal({
            controller: 'ListsSingleModalController',
            template: '/app/lists/lists-single-modal-form-view.html',
            data: { list: null }
        });
        
        promise.then(function(){
            $scope.grid.update();
            ui.success("TRANSACTIONS_ADD_SUCCESS");
        }, _parseError);
    };
    
    $scope.actionbar.openTransaction = function( transactionId ){
        var promise = modals.addModal({
            controller: 'TransactionsSingleModalController',
            template: '/app/transactions/add-transaction-modal-form-view.html',
            data: { transaction: transactionId }
        });
        
        promise.then(function(){}, _parseError);
    };
    
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
    $scope.grid.updateTransactions();
    $scope.grid.updateSummary();
}]);