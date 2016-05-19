var app = angular.module('myWallet');

app.controller('UiMessageController', [ '$scope', 'UiMessagesService',
function($scope, ui) {

    $scope.messages = ui.messages;
    $scope.ui = ui;

    $scope.$watch(function(ui) {
        return ui.messages;
    }, function(value) {
        $scope.messages = value;
    });

} ]);