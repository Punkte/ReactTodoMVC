import { Todo } from './Interfaces'

declare type ChangeCallback = (store: TodoStore) => void

class TodoStore {

    private static i = 0
    public todos: Todo[]
    private callbacks: ChangeCallback[]

    constructor () {
        this.callbacks = []
        this.todos = []
    }

    static increment () {
        return this.i++
    }

    inform () {
        this.callbacks.forEach(cb => cb(this))
    }

    onChange (cb: ChangeCallback) {
        this.callbacks.push(cb)
    }

    addTodo (title: string): void {

        this.todos = [
            {
                id: TodoStore.increment(),
                title,
                completed: false
            },
            ...this.todos
        ]
        this.inform()

    }

    removeTodo (todo: Todo): void {
        this.todos = this.todos.filter(el => el !== todo)
        this.inform()
    }

    updateTitle (todo: Todo, title: string) {
        this.todos = this.todos.map(t => t === todo ? { ...t, title } : t)
        this.inform()
    }

    toggleTodo (todo: Todo) {
        this.todos = this.todos.map(t => t === todo ? { ...t, completed: !t.completed } : t)
        this.inform()
    }

    toggleAll (completed = true) {
        this.todos = this.todos.map(t => t.completed !== completed ? { ...t, completed } : t)
        this.inform()
    }

    clearCompleted (): void {
        this.todos = this.todos.filter(t => !t.completed)
        this.inform()
    }

}

export default TodoStore
