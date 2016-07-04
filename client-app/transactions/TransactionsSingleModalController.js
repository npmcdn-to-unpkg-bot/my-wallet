/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.ui');

app.controller('TransactionsSingleModalController', [ '$scope', '$uibModalInstance', 'TransactionsService', 'WalletsService', 'transaction', function($scope, modal, transactions, wallets, transaction_id){
    
    $scope.page = {};
    $scope.page.title = (transaction_id==null)? 'Nova transação' : null;
    $scope.page.description = (transaction_id==null)? 'Descreva o motivo do gasto/receita, escolha uma carteira e informe o valor gasto.' : null;
    
    $scope.formStatus = true;
    
    $scope.data = {
        transaction_description: null,
        transaction_wallet: null,
        transaction_date_string: null,
        transaction_ammount: null
    };
    
    $scope.wallets = [];
    
    var parseError = function(err){
        $scope.formStatus = true;
        alert(err.message);
    };
    
    var parseTransaction = function(response){
        
    };
    
    $scope.save = function(){
        var data = {};
        
        $scope.data;
        
        transactions.save(data).then(function(response){
            parseTransaction(response);
            modal.close(transaction);
        }, parseError);
    };
    
    $scope.cancel = function(){
        modal.close(false);
    };
        
    // Load data
    wallets.getWallets().then(function(wallets){
        // Parse wallets
        for(var x in wallets){
            $scope.wallets.push(wallets[x]);
        }

        // Load transaction data
        if (transaction_id != null){

            $scope.formStatus = false;

            transactions.getTransactionById(transaction_id).then(function(response){
                parseTransaction(response);
                $scope.formStatus = true;
            }, parseError);
        }
    }, parseError);
    
}]);