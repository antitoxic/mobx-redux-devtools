import {Component, PropTypes} from 'react';
import {createDevTools} from 'redux-devtools';
import {createStore, compose} from 'redux';
import {reaction} from 'mobx';

import MobXMonitor from './monitor';

export const ActionTypes = {
    MOBX_UPDATE: 'MOBX_UPDATE'
}

export default class DevTools extends Component {
    static instrument;
    static ReduxDevTools;

    static propTypes = {
        hydrate: PropTypes.func.isRequired,
        serialize: PropTypes.func.isRequired,
        observable: PropTypes.object.isRequired,
        enhancers: PropTypes.array
    };

    static defaultProps = {
        enhancers: []
    };

    static childContextTypes = {
        store: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
        const {observable, hydrate, serialize, enhancers, children} = props;
        const ReduxDevTools = createDevTools(
            <MobXMonitor {...{hydrate, observable}}>
                {children}
            </MobXMonitor>
        );
        const enhancer = compose.apply(this, [ReduxDevTools.instrument()].concat(enhancers))
        this.store = createStore(function (state={}, action) {
            if (action.type != ActionTypes.MOBX_UPDATE) return state;
            return action.state
        }, serialize(observable), enhancer);
        reaction(() => serialize(observable), state => {
            if (observable.$mobx.fromJS) {
                observable.$mobx.fromJS = false;
                return;
            }
            this.store.dispatch({type: 'MOBX_UPDATE', state})
        });
        this.ReduxDevTools = ReduxDevTools;
    }

    shouldComponentUpdate() {
        return false;
    }

    getChildContext() {
        return {store: this.store};
    }

    render() {
        const ReduxDevTools = this.ReduxDevTools;
        return <ReduxDevTools/>
    }
}