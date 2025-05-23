express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new Database('./users.db', { verbose: console.log }); // Логирование SQL-запросов

// Создание таблицы
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT 
  )
`);

const db1 = new Database('./exs.db', { verbose: console.log });

db1.exec(`
  CREATE TABLE IF NOT EXISTS exers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course TEXT NOT NULL,
    name TEXT NOT NULL,
    lessons INTEGER
)
`)

db1.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER,
    course TEXT NOT NULL,
    name TEXT NOT NULL,
    exercice TEXT NOT NULL,
    lesson TEXT NOT NULL,
    variants TEXT NOT NULL
  )
`)


app.post('/req', (req, res) => {
  console.log('Получен запрос:', req.body); // Логируем тело запроса
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Поле "name" обязательно' });
  }

  try {
    const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, password);
    

    if (result.changes > 0) {
      res.status(201).json({ success: true, userId: result.lastInsertRowid });
    } else {
      throw new Error('Не удалось добавить пользователя');
    }
  } catch (error) {
    console.error('Ошибка базы данных:', error.message); // Детальный лог
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error.message 
    });
  }
});

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log('Запрос: ', req.body)

    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password)

    if (user) {
        res.status(200).json({
            name: user.name,
            email: user.email,
            password: user.password
        })
    } else {
        res.status(404).json({
            error: 'User not found!'
        })
    }
})

app.get('/exercices/:course', (req, res) => {
    const course = req.params.course
    const exs = db1.prepare(`SELECT * FROM exers WHERE course = ?`).all(course)

    if (!exs) {
        res.status(404).json({ error: 'Not Found' })
        return;
    }

    console.log(exs)
    res.status(200).json(exs)
})

app.get('/exercices/:course/:id', (req, res) => {
  const course = req.params.course
  const id = req.params.id
  const lessons = db1.prepare(`SELECT * FROM lessons WHERE course = ? AND id = ?`).all(course, id)

  if (lessons.count <= 0) { 
    res.status(404).json({ error: 'No lesssons' })
    return;
  }

  console.log(lessons)

  res.status(200).json(lessons)
})

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));