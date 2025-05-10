const express = require('express')
const Database = require('better-sqlite3')
const app = express()

const db = new Database('./users.db')

app.use(express.json())

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
`)

app.get('/', (req, res) => { 
    res.send('<h1>Hello, Nino!</h1>') 
})

app.get('/req', (req, res) => {
    res.send('<h1>Out</h1>')
})

// app.post('/req', (req, res) => {
//     const { name } = req.body

//     // if (!name) {
//     //     return res.status(400).json({
//     //         message: 'Please provide a name'
//     //     })
//     // }

//     const sql = "INSERT INTO users (name) VALUES (?)"
//     const result = db.prepare(sql).run(name)
//     res.send('<h1>Out</h1>')

//     // if (result.changes > 0) {
//     //     res.status(200).json({
//     //         message: "User added succefully"
//     //     })
//     // }
// })

app.listen(3000, () => {
    console.log('Server running on port 3000')
    console.log('https://localhost:3000/')
})