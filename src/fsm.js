class trans {
    constructor (state, trans_name) {
        this.state = state;
        this.trans_name = trans_name;
    }
}
    
const TRANSITIONS_PROP_NAME = "transitions";

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;

        this.transitionHistory = [];
        this.currStateIndex = 0;
        this.transitionHistory.push(new trans(config.initial, null));
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.transitionHistory[this.currStateIndex].state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (let avail_trans in this.config.states[this.getState()][TRANSITIONS_PROP_NAME]) {
            if (this.config.states[this.getState()][TRANSITIONS_PROP_NAME][avail_trans] === state) {
                if (this.transitionHistory.length > this.currStateIndex + 1) {
                    this.transitionHistory.length = this.currStateIndex + 1;
                }
                this.transitionHistory.push(new trans(state, avail_trans));
                this.currStateIndex++;
                return true;
            }
        }

        if (this.config.states.hasOwnProperty(state)) {
            if (this.transitionHistory.length > this.currStateIndex + 1) {
                this.transitionHistory.length = this.currStateIndex + 1;
            }
            this.transitionHistory.push(new trans(state, null));
            this.currStateIndex++;
            return true;
        }

        throw new Error(`No transition to state \"${state}\" found`);
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let avail_trans in this.config.states[this.getState()][TRANSITIONS_PROP_NAME]) {
            if (avail_trans === event) {
                if (this.transitionHistory.length > this.currStateIndex + 1) {
                    this.transitionHistory.length = this.currStateIndex + 1;
                }
                this.transitionHistory.push(new trans(this.config.states[this.getState()][TRANSITIONS_PROP_NAME][avail_trans], event));
                this.currStateIndex++;
                return true;
            }
        }

        throw new Error(`No state for transition \"${event}\" found`);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.transitionHistory = [];
        this.currStateIndex = 0;
        this.transitionHistory.push(new trans(this.config.initial, null));
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let arrStates = [];

        if (event) {
            for (let state in this.config.states) {
                loop:
                for (let avail_trans in this.config.states[state][TRANSITIONS_PROP_NAME]) {
                    if (avail_trans === event) {
                        if (!arrStates.includes(state)) {
                            arrStates.push(state);
                        }
                        break loop;
                    }
                }
            }
            
        } else {
            for (let state in this.config.states) {
                for (let avail_trans in this.config.states[state][TRANSITIONS_PROP_NAME]) {
                    if (!arrStates.includes(state)) {
                        arrStates.push(state);
                    }
                }
            }
        }

        return arrStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.currStateIndex > 0) {
            this.currStateIndex--;
            return true;
        }

        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.currStateIndex < this.transitionHistory.length - 1) {
            this.currStateIndex++;
            return true;
        }

        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        let last_state = this.transitionHistory[this.currStateIndex];
        last_state.trans_name = null;
        this.transitionHistory = [last_state];
        this.currStateIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
