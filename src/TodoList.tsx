import * as React from 'react'
import TodoStore from './TodoStore'
import { Todo } from './Interfaces'
import TodoItem from './TodoItem'
import classNames from 'classnames'

const { Fragment } = React

type FilterOptions = 'completed' | 'active' | 'all'

const Filters = {
    completed: (todo: Todo) => todo.completed,
    active: (todo: Todo) => !todo.completed,
    all: (todo: Todo) => true
}

interface TodoListProps { }
interface TodoListState {
    todos: Todo[]
    newTodo: string
    filter: FilterOptions
}

declare type TodoAction = (todo: Todo) => any

declare global {
    interface Window {
        store: TodoStore
    }
}

class TodoList extends React.PureComponent<TodoListProps, TodoListState> {

    private store: TodoStore
    private toggleTodo: TodoAction
    private destroyTodo: TodoAction
    private updateTitle: (todo: Todo, title: string) => void
    private clearCompleted: () => void

    constructor (props: TodoListProps) {
        super(props)
        this.store = new TodoStore()
        window.store = this.store
        this.state = {
            todos: [],
            newTodo: '',
            filter: 'all'
        }
        this.store.onChange((store) => {
            /**
             * Connexion between the store and the component
             */
            this.setState({ todos: store.todos })
        })
        this.toggleTodo = this.store.toggleTodo.bind(this.store)
        this.destroyTodo = this.store.removeTodo.bind(this.store)
        this.updateTitle = this.store.updateTitle.bind(this.store)
        this.clearCompleted = this.store.clearCompleted.bind(this.store)
    }

    componentDidMount () {
        this.store.addTodo('lol')
        this.store.addTodo('lol2')
    }

    get remainingCount (): number {
        const { todos } = this.state
        return todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0)
    }

    get completedCount (): number {
        const { todos } = this.state
        return todos.reduce((count, todo) => todo.completed ? count + 1 : count, 0)
    }

    updateNewTodo = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ newTodo: (e.target as HTMLInputElement).value })
    }

    addTodo = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            this.store.addTodo(this.state.newTodo)
            this.setState({ newTodo: '' })
        }
    }

    toggleAll = (e: React.FormEvent): void => {
        this.store.toggleAll(this.remainingCount > 0)
    }

    setFilter = (filter: FilterOptions) => {
        return (e: React.MouseEvent<HTMLElement>) => {
            this.setState({ filter })
        }
    }

    render () {
        const { todos, newTodo, filter } = this.state
        const { remainingCount, completedCount } = this
        const todosFiltered = todos.filter(Filters[filter])
        return (
            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <input
                        className="new-todo"
                        placeholder="What needs to be done?"
                        onInput={ this.updateNewTodo }
                        onKeyPress={ this.addTodo }
                        onChange={ () => null }
                        value={ newTodo }
                    />
                </header>
                <section className="main">
                    { todos.length > 0 && (
                        <Fragment>
                            <input
                                id="toggle-all"
                                className="toggle-all"
                                type="checkbox"
                                checked={ remainingCount === 0 }
                                onChange={ this.toggleAll }
                            />
                            <label htmlFor="toggle-all">Mark all as complete</label>
                        </Fragment>
                        )
                    }
                    <ul className="todo-list">
                    { todosFiltered.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={ todo }
                            onToggle={ this.toggleTodo }
                            onDestroy={ this.destroyTodo }
                            onUpdate={ this.updateTitle }
                        />
                    )) }
                    </ul>
                </section>
                <footer className="footer">
                    { remainingCount > 0 && <span className="todo-count"><strong>{ remainingCount }</strong> item{ remainingCount > 1 && 's' } left</span>}
                    <ul className="filters">
                        <li>
                            <a
                                href="#/"
                                className={ classNames({ selected: filter === 'all' }) }
                                onClick={ this.setFilter('all') }
                            >
                                All
                            </a>
                        </li>
                        <li>
                            <a
                                href="#/active"
                                className={ classNames({ selected: filter === 'active' }) }
                                onClick={ this.setFilter('active') }
                            >
                                Active
                            </a>
                        </li>
                        <li>
                            <a
                                href="#/completed"
                                className={ classNames({ selected: filter === 'completed' }) }
                                onClick={ this.setFilter('completed') }
                            >
                                Completed
                            </a>
                        </li>
                    </ul>
                    { completedCount > 0 &&
                        <button
                            className="clear-completed"
                            onClick={ this.clearCompleted }
                        >
                            Clear completed
                        </button>
                    }
                </footer>
            </section>
        )
    }

}

export default TodoList
