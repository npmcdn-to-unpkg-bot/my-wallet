var app = angular.module('myWallet.ui');

/**
 * The `batchLog` service allows for messages to be queued in memory and flushed
 * to the console.log every 50 seconds.
 * 
 */
app.service('UiMessagesService', [ '$timeout', function($timeout) {

    var count = 1;
    var that = this;

    this.messages = [];

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

	this.messages.push(message);

//	$timeout(function() {
//	    messages.splice(messages.indexOf(message), 1);
//	}, 4000);
    };
    
    this.error = function(err){
        this.add(err.message, 'danger');
    };
    
    this.success = function(message){
        this.add(message, 'success');
    };

    this.remove = function(index) {
	this.messages.splice(index, 1);
    };

    this.hasMessages = function() {
	return (this.messages.length > 0);
    };

    this.clear = function() {
	this.messages.length = 0;
    };

    this.getMessages = function() {
	return this.messages;
    };

} ]);