// this requires JQuery 1.3.1
    
var sprite = function(active, canvasElem) {
    if (active === null) {
        throw new Error('active is required');
    }
    if (canvasElem === null || typeof(canvasElem.getContext) !== 'function') {
        throw new Error('canvasElem is required');
    }
    this.active = active;
    this.canvasElem = canvasElem;
    this.canvasWidth = $(canvasElem).width();
    this.canvasHeight = $(canvasElem).height();
    var me = this;
    var getContext = function() {
        return me.canvasElem.getContext('2d');
    }
    
    this.draw = function() {
        var context = getContext();
        context.fillStyle = "rgba(0, 0, 1.0, 1.0)";
        context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}