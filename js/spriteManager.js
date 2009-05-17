// listens to controller for when actives are added or removed.
// when an active is added, the SM will create a new sprite and the HTML
// element corresponding to it. when the active is removed, the sprite object
// will be removed and so will the HTML element.
// when update is called on this object, it will update all of its
// managed sprites.
// the drawMaker is a function that is passed an active object and 
// will return a function suitable for use by a sprite object for
// drawing itself.

// requires jQuery, sprite, eventer

var spriteManager = function(screenId, spriteTemplateId, controller, drawMaker) {
    if (!screenId) {
        throw new Error('screenId required');
    }
    if (!spriteTemplateId) {
        throw new Error('spriteTemplateId required');
    }
    if (!controller || !controller.eventer) {
        throw new Error('controller required');
    }
    if (typeof(drawMaker) !== 'function') {
        throw new Error('drawMaker is required');
    }
    var screen = $(screenId)[0];
    var spriteTemplate = $(spriteTemplateId)[0];
    if (!screen) {
        throw new Error('screen must exist');
    }
    if (!spriteTemplate) {
        throw new Error('spriteTemplate must exist');
    }
    
    this.sprites = [];
    var me = this;
    
    var onActiveAdded = function(args) {
        // generate new element from template
        var spriteElem = $($(spriteTemplateId).html()).appendTo(screenId).get(0);
        var newSprite = new sprite(args.active, spriteElem, drawMaker(args.active));
        me.sprites.push(newSprite);
    }
    
    var onActiveRemoved = function(args) {
        // remove sprite from array
        var removeMe;
        me.sprites = $.grep(me.sprites, function(aSprite, index) {
            if (aSprite.active === args.active) {
                removeMe = aSprite;
                return false;
            }
            return true;
        })
        // remove sprite element from document
        $(removeMe.spriteElem).remove();
    }
    
    controller.eventer.subscribe('activeAdded', onActiveAdded);
    controller.eventer.subscribe('activeRemoved', onActiveRemoved);
    
    this.update = function() {
        $.each(this.sprites, function(index, sprite) {
            sprite.update();
        })
    }
}