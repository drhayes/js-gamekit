// an object that defines a series of animations.
// an animation is a path to an image (a series of frames tiled
// horizontally), a width, a height, and an array of frames.
// each frame is an index into the series of image frames and
// and interval, which is either a number or a function that returns
// a number.
// really just a shortcut object to speed testing of the animationManager.
// the real animation definitions will be loaded from a file containing
// an object literal.
// requires jquery

var animationDefinition = function(args) {
    var settings = $.extend({}, {
        path: '',
        width: 32,
        height: 32,
        frames: []
    }, args);
    this.path = settings.path;
    this.width = settings.width;
    this.height = settings.height;
    this.frames = settings.frames;
    
    this.addFrame = function(frameObj) {
        var defaults = {
            interval: 1
        };
        defaults['index'] = this.frames.length;
        var newFrame = $.extend(defaults, frameObj);
        this.frames[this.frames.length] = newFrame;
    }
}