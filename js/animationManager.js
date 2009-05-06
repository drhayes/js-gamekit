// loads an object that represents how to animate a series
// of frames loaded from one image using the CSS sprite effect.
// user registers an id with the animationManager and then calls
// getFrame in successive updates. the animationManager will return
// the CSS to apply to an HTML element that will display the frame
// of animation based on the logic of the animation definitions.

var animationManager = (function() {
    
    // private class used to track registered animations
    var animationState = function(definitionId) {
        this.definitionId = definitionId;
        this.frameIndex = 0;
        this.interval = 0;
    }
    
    return function(definition) {
        if (!definition) {
            throw new Error('definition is required');
        }
        // object that tracks the state of registered animations
        var stateTracker = {};
    
        this.registerAnimation = function(definitionId, animationId) {
            if (!definitionId) {
                throw new Error('definitionId is required');
            }
            if (!animationId) {
                throw new Error('animationId is required');
            }
            if (!definition.hasOwnProperty(definitionId)) {
                throw new Error('must use definitionId from set of definitions');
            }
            stateTracker[animationId] = new animationState(definitionId);
        }
    
        this.getFrame = function(animationId) {
            if (!animationId) {
                throw new Error('animationId is required');
            }
            if (!stateTracker.hasOwnProperty(animationId)) {
                throw new Error('unregistered animation id');
            }
            // pull the state for this id
            var state = stateTracker[animationId];
            // which definition are we using?
            var animDefinition = definition[state.definitionId];
            var frameDefinition = [];
            // background: transparent url(../assets/images/animation.png) 0px 0px no-repeat;
            frameDefinition.push('background: transparent');
            frameDefinition.push('url(' + animDefinition.path + ')');
            frameDefinition.push('' + (animDefinition.frames[state.frameIndex].index * (-animDefinition.width)) + 'px');
            frameDefinition.push('0px');
            frameDefinition.push('no-repeat;');
            // advance to the next frame for this animation if the frame's interval has passed
            state.interval++;
            if (state.interval >= animDefinition.frames[state.frameIndex].interval) {
                state.frameIndex = (state.frameIndex + 1) % animDefinition.frames.length;
                state.interval = 0;
            }
            return frameDefinition.join(' ');
        }
    }
})();