import {Component, PropTypes} from 'react';
import {createDevTools} from 'redux-devtools';
import {createStore, compose} from 'redux';
import {reaction} from 'mobx';

import MobXMonitor from './monitor';

export const ActionTypes = {
    MOBX_UPDATE: 'MOBX_UPDATE'
}

const devtoolRegistry = [];

function getStoreAndDevTools(props) {
    const {observable, hydrate, serialize, enhancers, children} = props;
    for (let i = 0; i < devtoolRegistry.length; i++) {
        let registration = devtoolRegistry[i];
        // one observable can only have 1 devtool enabled
        if (registration.observable == observable) {
            return registration.result;
        }
    }
    const ReduxDevTools = createDevTools(
        <MobXMonitor {...{hydrate, observable}}>
                     {children}
        </MobXMonitor>
    );
    const enhancer = compose.apply(this, [ReduxDevTools.instrument()].concat(enhancers))
    const store = createStore(function (state={}, action) {
        if (action.type != ActionTypes.MOBX_UPDATE) return state;
        return action.state
    }, serialize(observable), enhancer);
    reaction(() => serialize(observable), state => {
        if (observable.$mobx.fromJS) {
            observable.$mobx.fromJS = false;
            return;
        }
        store.dispatch({type: ActionTypes.MOBX_UPDATE, state})
    });
    const result = [store, ReduxDevTools];
    devtoolRegistry.push({result, observable});
    return result
};

export default class DevTools extends Component {
    ReduxDevTools;

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
        const [store, ReduxDevTools] = getStoreAndDevTools(props);
        this.store = store;
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
