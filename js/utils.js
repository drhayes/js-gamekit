// the mish-mash library of random stuff
    
// define our namespace

if (typeof(window.utils) === 'undefined') {
    window.utils = {};
    
    window.utils.rand = function(lo, hi) {
        return Math.floor(Math.random() * (hi - lo)) + lo;
    }
    
    window.utils.consoleFix = function() {
        // blank out the console if it doesn't already exist
        if (typeof(console) === 'undefined') {
            window.console = {
                log: function() {}
            }
        };
    }
}
