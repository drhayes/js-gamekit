// encapsulates an HTML element that will be drawn to and is linked
// to an "active", something that exists down at the model layer that
// has an update method and a position.
// the sprite's update position simply changes the position of the
// associated HTML element and calls the passed-in draw method
// on it.

// requires jQuery
    
var sprite = function(active, spriteElem, draw) {
    if (!active) {
        throw new Error('active is required');
    }
    if (!spriteElem) {
        throw new Error('spriteElem is required');
    }
    if (!draw) {
        throw new Error('draw is required');
    }
    this.active = active;
    this.spriteElem = spriteElem;
    this.spriteWidth = $(spriteElem).width();
    this.spriteHeight = $(spriteElem).height();
    this.draw = draw;
    
    this.update = function() {
        $(this.spriteElem).attr('top', this.active.position.y + 'px')
            .attr('left', this.active.position.x + 'px');
        this.draw(this.spriteElem);
    }
}