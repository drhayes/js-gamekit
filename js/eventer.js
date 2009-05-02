// requires jQuery
// an object that handles subscribing to and firing events    

var eventer = function() {
    var subscribers = {};
    
    this.subscribe = function(eventName, callback) {
        if (eventName === null) {
            throw new Error('eventName required');
        }
        if (typeof(callback) !== 'function') {
            throw new Error('callback must be function');
        }
        var callbacks = subscribers[eventName];
        if (typeof(callbacks) === 'undefined') {
            callbacks = [];
        }
        callbacks.push(callback);
        subscribers[eventName] = callbacks;
    }
    
    this.fire = function(eventName) {
        if (eventName === null) {
            throw new Error('eventName required');
        }
        // if no subscribers for an event, exit early
        if (!subscribers.hasOwnProperty(eventName)) {
            return;
        }
        var callbacks = subscribers[eventName];
        if (callbacks !== null) {
            $.each(callbacks, function(index, callback) {
                callback();
            })
        }
    }
}