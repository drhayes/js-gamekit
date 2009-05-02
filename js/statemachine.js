// requires jQuery
// Hierarchical State Machine implementation translated from pseudo-Python in
// "Artificial Intelligence for Games" by Ian Millington

(function() {

    var updateResult = function(ctorParam) {
        var args = $.extend({
            actions: [],
            transition: null,
            level: 0
        }, ctorParam);
        this.actions = args.actions;
        this.transition = args.transition;
        this.level = args.level;
    }
    
    updateResult.doNothing = new updateResult();
    
    // a transition between any two states
    var transition = function(ctorParam) {
        var args = $.extend({
            'level': 0,
			'triggered': function() { return false; },
			'actions': [],
			'targetState': null
        }, ctorParam);
        this.level = args.level;
        this.triggered = args.triggered;
        this.actions = args.actions;
        this.targetState = args.targetState;
    }

    // shared constructor-like thing between state and subMachineState
    var stateInitialize = function(params) {
        var args = $.extend({
            'actions': [],
            'entryActions': [],
            'exitActions': [],
            'transitions': [],
            'updater': null
        }, params);
        this.actions = args.actions;
        this.entryActions = args.entryActions;
        this.exitActions = args.exitActions;
        this.transitions = args.transitions;
        this.updater = args.updater;
    }
    
    var state = function(ctorParams) {
        stateInitialize.apply(this, arguments);
        
        this.getStates = function() {
            return [this];
        }
        
        this.update = function() {
            if (typeof(this.updater) === 'function') {
                return this.updater();
            }
            return new updateResult({
                actions: this.actions
            });
        }
    }
    
    // shared constructor-like thing between HSM and subMachineState
    var hierachicalStateInitialize = function(params) {
        var args = $.extend({
            states: [new state()],
            initialState: null
        }, params);
        this.states = args.states;
        // initial state defaults to passed-in initial state, first given state, or null
        this.initialState = args.initialState || (this.states.length > 0 ? this.states[0] : null);
        this.currentState = this.initialState;
    }
    
    var hierarchicalStateMachine = function(ctorParams) {        
        hierachicalStateInitialize.apply(this, arguments);

        // actions is always empty for the base HSM
        this.actions = [];

        this.addStates = function(states) {
            states = states || this.states;
            var me = this;
            $.each(states, function(index, state) {
                state.parentStateMachine = me;
            })
        }
        
        this.addStates();
        
        // gets the current state stack
        this.getStates = function() {
            if (this.currentState) {
                return this.currentState.getStates();
            }
            else {
                return [];
            }
        }
        
        this.update = function() {
            // if we're in no state, use the initial state
            if (!this.currentState) {
                this.currentState = this.initialState;
                return this.currentState.entryActions;
            }
            
            var result;
            // iterate transitions looking for any that have fired
            var triggeredTransition = null;
            $.each(this.currentState.transitions, function(index, transition) {
                if (transition.triggered()) {
                    triggeredTransition = transition;
                    return false; // break out
                }
            });
            
            if (triggeredTransition) {
                // triggered a transition that starts at this level
                result = new updateResult({
                    actions: [],
                    transition: triggeredTransition,
                    level: triggeredTransition.level
                });
            }
            else {
                // recurse down, looking for transitions...
                result = this.currentState.update();
            }
            
            // check for result containing transition
            if (result.transition) {
                if (result.level === 0) {
                    var targetState = result.transition.targetState;
                    $.merge(result.actions, this.currentState.exitActions);
                    $.merge(result.actions, result.transition.actions);
                    $.merge(result.actions, targetState.entryActions);
                    
                    this.currentState = targetState;
                    // this will mean more for sub machine states...
                    $.merge(result.actions, this.actions);
                    // clear out transition so no one else touches it
                    result.transition = null;
                }
                else if (result.level > 0) {
                    // destined for a higher level, so exit our current state
                    $.merge(result.actions, this.currentState.exitActions);
                    this.currentState = null;
                    result.level -= 1;
                }
                else {
                    var targetState = result.transition.targetState;
                    var targetMachine = targetState.parentStateMachine;
                    $.merge(result.actions, targetMachine.updateDown(targetState, -result.level));
                    $.merge(result.actions, result.transition.actions);
                    // clear the transition so no one else does it
                    result.transition = null;
                }
            }
            else {
                // no transition, so do our normal action
                $.merge(result.actions, this.actions);
            }
            
            return result;
        }
        
        this.updateDown = function(state, level) {
            var actions = [];
            // if we're not at the top level, continue recursing; otherwise, no actions to add to
            if (level > 0) {
                actions = this.parentStateMachine.updateDown(this, level - 1);
            }
            
            // if we have a current state, exit it
            if (this.currentState) {
                $.merge(actions, this.currentState.exitActions);
            }
            
            this.currentState = state;
            $.merge(actions, state.entryActions);
            return actions;
        }
    }
    
    var subMachineState = function() {
        // it's a floor wax! it's a dessert topping!
        stateInitialize.apply(this, arguments);
        // do this one second -- we want hsm's update function
        hierachicalStateInitialize.apply(this, arguments);
        
        this.addStates();
        
        this.getStates = function() {
            if (this.currentState) {
                var result = $.merge([], [this]);
                return $.merge(result, this.currentState.getStates());
            }
            else {
                return [this];
            }
        }
    }
    
    subMachineState.prototype = new hierarchicalStateMachine();
    
    // set to namespace
    window.updateResult = updateResult;
    window.transition = transition;
    window.state = state;
    window.hierarchicalStateMachine = hierarchicalStateMachine;
    window.subMachineState = subMachineState;
})();
