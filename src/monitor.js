import {Component, PropTypes, Children} from 'react';
import {ActionTypes} from 'redux-devtools';
import {transaction} from 'mobx';

export default class MobXMonitor extends Component {
    static update = function (props, state, action) {
        var [MonitorComponent, monitorProps] = getComponentAndProps(props);
        return Object.assign({
            mobx: {
                shouldUpdate: action.type
            },
        }, MonitorComponent.update(monitorProps, state, action))
    };

    static propTypes = {
        computedStates: PropTypes.array,
        currentStateIndex: PropTypes.number,
        observable: PropTypes.object.isRequired,
        hydrate: PropTypes.func.isRequired
    };

    syncMobx(props) {
        if (props.monitorState.mobx.shouldUpdate != ActionTypes.JUMP_TO_STATE) return;

        var {
            computedStates,
            currentStateIndex,
            hydrate,
            observable
        } = props;
        const currentState = computedStates[currentStateIndex].state;
        transaction(() => {
            hydrate(observable, currentState);
            observable.$mobx.fromJS = true;
        })
    }

    render() {
        var [MonitorComponent, monitorProps] = getComponentAndProps(this.props);
        var {children, ...otherProps} = this.props;
        var monitorProps = Object.assign({}, otherProps, monitorProps);
        setTimeout(() => this.syncMobx(this.props), 1) //
        return <MonitorComponent {...monitorProps} />;
    }
}


const getComponentAndProps = function (props) {
    var monitorElement = Children.only(props.children);
    return [monitorElement.type, monitorElement.props]
}
