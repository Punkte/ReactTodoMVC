import * as React from 'react'
import { Todo } from './Interfaces'
import classNames from 'classnames'

interface Props {
    todo: Todo
    onToggle: (todo: Todo) => void
    onDestroy: (todo: Todo) => void
    onUpdate: (todo: Todo, title: string) => void
}

interface State {
    editing: boolean
    title: string
}

class TodoItem extends React.PureComponent<Props, State> {

    constructor (props: Props) {
        super(props)
        this.state = {
            editing: false,
            title: ''
        }
    }

    /**
     * Using a PureComponent to re-render only if the props/state changed
     */

    /*
    shouldComponentUpdate = (nextProps: Props, nextState: State) => {
        return nextProps.todo !== this.props.todo
    }
    */

    toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { onToggle, todo } = this.props
        onToggle(todo)
    }

    destroy = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onDestroy(this.props.todo)
    }

    startEditing = (e: React.MouseEvent<HTMLLabelElement>) => {
        this.setState({ editing: true, title: this.props.todo.title })
    }

    handleSubmit = () => {
        this.setState({ editing: false })
        const { onUpdate, todo } = this.props
        const { title } = this.state
        onUpdate(todo, title)
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            this.setState({ editing: false })
        } else if (e.key === 'Enter') {
            this.handleSubmit()
        }
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({ title: (e.target as HTMLInputElement).value })
    }

    render () {
        const { todo } = this.props
        const { editing, title } = this.state
        return (
            <li className={ classNames({ completed: todo.completed, editing: editing }) } >
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        onChange={ this.toggle }
                        checked={ todo.completed }
                    />
                    <label
                        onDoubleClick={ this.startEditing }
                    >
                        { todo.title }
                    </label>
                    <input
                        type="text"
                        className="edit"
                        value={ title }
                        onBlur={ this.handleSubmit }
                        onKeyDown={ this.handleKeyDown }
                        onChange={ this.handleChange }
                    />
                    <button
                        className="destroy"
                        onClick={ this.destroy }
                    ></button>
                </div>
                <input
                    className="edit"
                    value={ title }
                    onBlur={ this.handleSubmit }
                    onKeyDown={ this.handleKeyDown }
                    onChange={ this.handleChange }
                    type="text"
                />
            </li>
        )
    }

}

export default TodoItem
