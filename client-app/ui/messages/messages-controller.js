var app = angular.module('myWallet');

app.controller('UiMessageController', [ '$scope', 'UiMessagesService',
function($scope, ui) {

    $scope.messages = ui.messages;
    
    $scope.remove = function( i ){
        ui.remove( i );
    };
    
} ]);