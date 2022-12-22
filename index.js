const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const { userInfo } = require('os');

const app = express();
app.use(express.json());

const jsonPath = path.resolve('./files/tasks.json');

app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf-8')
    res.send(jsonFile);
});

app.post('/tasks', async (req, res) => {
    const todo = req.body;

    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    const lastIndex = todosArray.length -1;
    const newId = todosArray[lastIndex].id +1;

    todosArray.push({...todo, id:newId});
    await fs.writeFile(jsonPath, JSON.stringify(todosArray))
    res.end()
});


app.put('/tasks', async (req, res) => {
    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {id, title, description, status} = req.body;

    const todoIndex = todosArray.findIndex(todo => todo.id === id);
    if (todoIndex >= 0) {
        todosArray[todoIndex].title = title;
        todosArray[todoIndex].description = description;
        todosArray[todoIndex].status = status;
    }

    await fs.writeFile(jsonPath, JSON.stringify(todosArray));
    res.send('To do up to date');
});

app.delete('/tasks', async (req, res) => {
    const todosArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {id} = req.body;

    const todoIndex = todosArray.findIndex(todo => todo.id === id);
    todosArray.splice(todoIndex, 1)

    await fs.writeFile(jsonPath, JSON.stringify(todosArray));
    res.end();
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
})
