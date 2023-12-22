const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

let todos = [
    {
        id: 1,
        text: 'Wake Up',
        completed: false
    },
    {
        id: 2,
        text: 'Go to Colz',
        completed: true
    },
    {
        id: 3,
        text: 'Attend CLass',
        completed: false
    },
];

app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.post('/api/todos', (req, res) => {
    const newTodo = req.body;
    todos.push(newTodo);
    res.status(201).json(newTodo);
})

app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const index = todos.findIndex(todo => todo.id == todoId);

    if (index !== -1) {
        todos.splice(index, 1);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});


app.put('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = req.body;
    
    const index = todos.findIndex(todo => todo.id == todoId);

    if (index !== -1) {
        todos[index] = updatedTodo;
        res.status(200).json(updatedTodo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});