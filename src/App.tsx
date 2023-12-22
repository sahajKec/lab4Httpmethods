// src/App.tsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Todo {
    id: number;
    task: string;
}

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [task, setTask] = useState<string>('');
    const [editId, setEditId] = useState<number | null>(null);
    const url:string = `http://localhost:3000/api/todos`

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await fetch(`${url}`);
        const data: Todo[] = await response.json();
        setTodos(data);
    };

    const addTodo = async () => {
        if (editId !== null) {
            // Handle update
            await fetch(`${url}/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task }),
            });

            const updatedTodos = todos.map((todo) =>
                todo.id === editId ? { ...todo, task } : todo
            );

            setTodos(updatedTodos);
            setEditId(null);
        } else {
            // Handle create new
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task }),
            });

            const newTodo: Todo = await response.json();
            setTodos([...todos, newTodo]);
        }

        setTask('');
    };

    const editTodo = (id: number) => {
        const selectedTodo = todos.find((todo) => todo.id === id);
        if (selectedTodo) {
            setTask(selectedTodo.task);
            setEditId(id);
        }
    };


    const deleteTodo = async (id: number) => {
        await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });

        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <div className="form-group">
                            <label htmlFor="taskInput">Task</label>
                            <input
                                type="text"
                                className="form-control"
                                id="taskInput"
                                placeholder="Enter task"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={addTodo}>
                            {editId !== null ? 'Update Task' : 'Add Task'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map((todo) => (
                            <li key={todo.id} className="list-group-item">
                                {todo.task}
                                <button
                                    type="button"
                                    className="btn btn-danger float-right ml-2"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    Remove
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning float-right"
                                    onClick={() => editTodo(todo.id)}
                                >
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default App;
