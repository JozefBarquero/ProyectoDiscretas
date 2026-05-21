const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


const db = new sqlite3.Database('./ranking.db', (err) => {
    if (err) {
        console.error("Error al abrir base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");

        db.run(`CREATE TABLE IF NOT EXISTS ranking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            puntos INTEGER NOT NULL,
            fecha TEXT NOT NULL
        )`);
    }
});


app.get('/api/ranking', (req, res) => {
    const query = `
        SELECT nombre, puntos, fecha 
        FROM ranking 
        ORDER BY puntos DESC 
        LIMIT 50
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


app.post('/api/ranking', (req, res) => {
    const { nombre, puntos } = req.body;

    if (!nombre || puntos === undefined) {
        return res.status(400).json({ error: "Nombre y puntos son requeridos" });
    }

    const fecha = new Date().toLocaleDateString('es-CR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const query = `INSERT INTO ranking (nombre, puntos, fecha) VALUES (?, ?, ?)`;

    db.run(query, [nombre, puntos, fecha], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({ success: true, id: this.lastID });
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en red en http://0.0.0.0:${PORT}`);
});