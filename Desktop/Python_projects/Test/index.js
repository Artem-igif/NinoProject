const express = require('express');
const Database = require('better-sqlite3');
const app = express();

const db = new Database('./users.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
    
})

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

app.get('/', (req, res) => { 
    res.send('<h1>Hello, Nino!</h1>') 
});

app.get('/req', (req, res) => {
    res.send('<h1>Out</h1>');
});

app.post('/req', (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            message: 'Please provide a name'
        });
    }

    try {
        const sql = "INSERT INTO users (name) VALUES (?, ?)";
        const result = db.prepare(sql).run(name);
        
        if (result.changes > 0) {
            res.status(201).json({
                message: "User added successfully",
                userId: result.lastInsertRowid
            });
        } else {
            res.status(500).json({
                message: "Failed to add user"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('https://localhost:3000/');
});