import {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {observable, createTransformer} from "mobx";
import {observer} from "mobx-react";
import DockMonitor from 'redux-devtools-dock-monitor';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DevTools from './mobx-redux-devtools/devtools';

class Todo {
    id;
    @observable title = '';
    @observable done = false;

    constructor(title, done, id) {
        this.title = title;
        this.done = done;
        this.id = id;
    }
}

class AppStore {
    @observable assignee = 'Morty';
    @observable todos = [
        new Todo("Read redux-devtool docs", true, 1),
        new Todo("Write a devtool monitor", false, 2),
        new Todo("Package the whole thing", false, 3),
    ];
}

const serializeState = createTransformer(store => ({
    assignee: store.assignee,
    todos: store.todos.map(serializeTodo),
}));

const serializeTodo = createTransformer(todo => ({
    title: todo.title,
    done: todo.done,
    id: todo.id
}));

function deserializeState(store, data) {
    store.todos = data.todos.map(todo => new Todo(todo.title, todo.done, todo.id));
    store.assignee = data.assignee
}

function tickTodo(todo) {
    todo.done = !todo.done
}

@observer
class TodoListView extends Component {
    render() {
        return <div>
            {this.props.todoList.assignee}
            <ul>
                {this.props.todoList.todos.map(todo =>
                    <TodoView todo={todo} key={todo.id} clickHandler={tickTodo}/>
                ) }
            </ul>
            <DevTools serialize={serializeState} hydrate={deserializeState} observable={store}>
                <DockMonitor toggleVisibilityKey='ctrl-h'
                             changePositionKey='ctrl-q'
                             changeMonitorKey='ctrl-m'
                             defaultPosition="bottom"
                             defaultIsVisible={true}>
                    <SliderMonitor/>
                    <LogMonitor theme='tomorrow'/>
                </DockMonitor>
            </DevTools>
        </div>
    }
}

@observer
class TodoView extends Component {
    render() {
        const {todo, clickHandler} = this.props;
        return <li className={"tree"} >
            <input
                type="checkbox"
                checked={todo.done}
                onClick={() => clickHandler(todo) }
            />{todo.title} <If condition={todo.done}>Done!</If>
        </li>
    }
}


var store = new AppStore();
ReactDOM.render(
    <TodoListView todoList={store}/>,
    document.getElementById('react')
);
