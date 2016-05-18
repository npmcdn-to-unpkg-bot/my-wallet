var app = angular.module('myWallet');

/**
 * The `batchLog` service allows for messages to be queued in memory and flushed
 * to the console.log every 50 seconds.
 * 
 */
app.service('UiMessagesService', [ '$timeout', function($timeout) {

    var count = 1;
    var messages = [];
    var that = this;

    this.incrementCount = function() {
	count++;
	return count;
    };

    this.getCount = function() {
	return count;
    };

    this.messageBundle = {
	ERROR_CONNECTION_PROBLEM : 'Unnable to connect to url: $'
    };

    this.getErrorMessage = function(key, val) {

	if (typeof this.messageBundle[key] !== 'undefined') {
	    text = this.messageBundle[key];
	} else {
	    text = key;
	}

	if (typeof val !== 'undefined') {
	    text = text.replace('$', val);
	}
	return text;
    };

    this.add = function(message, level, val) {

	if (typeof level === 'undefined') {
	    level = 'info';
	}

	var message = {
	    level : level,
	    message : that.getErrorMessage(message, val)
	};

	messages.push(message);

	$timeout(function() {
	    messages.splice(messages.indexOf(message), 1);
	}, 4000);
    };

    this.remove = function(index) {
	messages.splice(index, 1);
    };

    this.hasMessages = function() {
	return (messages.length > 0);
    };

    this.clear = function() {
	messages = [];
    };

    this.getMessages = function() {
	return messages;
    };

} ]);