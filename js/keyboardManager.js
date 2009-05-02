// requires jQuery

// does not support special keys beyond alphabet and numbers

var keyboardManager = function() {
    // used for callbacks and such
    var me = this;
    var dispatchCallback = function(event) {
        me.dispatch(event);
    }
    
    this.keyMap = {};
    
    // latch onto keydown and keyup events of the body element
    this.latch = function() {
        $('body').keydown(dispatchCallback);
    }
    
    // we are latched on construction
    this.latch();
    
    this.unlatch = function() {
        $('body').unbind('keydown', dispatchCallback);
    }
    
    this.dispatch = function(event) {
        var code = event.charCode;
        if (typeof(event.keyCode) !== 'undefined') {
            code = event.keyCode;
        }
        var handler = this.keyMap[String.fromCharCode(code).toLowerCase()];
        if (handler) {
            handler(event);
        }
    }
    
    this.bind = function(key, handler) {
        this.keyMap[key.toLowerCase()] = handler;
    }
    
    this.unbind = function(key) {
        delete this.keyMap[key];
    }
}