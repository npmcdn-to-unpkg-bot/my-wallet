/* 
 * My Wallet
 * It is a Money Coontroll application with Node.JS and Angular.js
 * This software is free for General Porpouses
 * @author: Max Andriani <max.andriani@gmail.com>
 */

var app = angular.module('myWallet.ui');

app.controller('TransactionsSingleModalController', [ '$scope', '$q', '$uibModalInstance', 'TransactionsService', 'WalletsService', 'transaction', function($scope, $q, modal, transactions, wallets, transaction_id){
    
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
        $scope.data.transaction_ammount = response.transaction_ammount;
        $scope.data.transaction_description = response.transaction_description;
        $scope.data.transaction_wallet = response.wallet_id;
        var tDate = response.transaction_date;
        $scope.data.transaction_date_string = tDate.days + "/" + tDate.month + "/" + tDate.year;
    };
    
    $scope.save = function(){
        var data = {};
        
        var ammountRegex = /[\d\,\.]+/;
        var dateRegex = /(\d{1,2})(?:\s)?\/(?:\s)?(\d{1,2})(?:\s)\/(?:\s)(\d{2,4})/;
        var parseDate;
        
        if (!ammountRegex.test($scope.data.transaction_ammount)){
            throw new Error('ERROR_TRANSACTION_INVALID_AMMOUNT');
        }
        
        if (!dateRegex.test($scope.data.transaction_date_string)){
            throw new Error('ERROR_TRANSACTION_INVALID_AMMOUNT');
        }
        
        parseDate = dateRegex.exec($scope.data.transaction_date_string);
        
        data.transaction_ammount = $scope.data.transaction_ammount.replace('.', ',');
        data.transaction_description = $scope.data.transaction_description;
        data.wallet_id = $scope.data.transaction_wallet;
        data.trasaction_date = {
            day: parseDate[1],
            month: parseDate[2],
            year: parseDate[3],
            hour: 0,
            minute: 0,
            seconds: 0
        };
        
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