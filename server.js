const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router('db.json');

// Middlewares
app.use(express.json());
app.use(express.static(__dirname));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ROTA DA API (backend)
app.use('/api/reviews', router);

// ROTAS DO SITE (frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/games.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'games.html'));
});
app.get('/reviews.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reviews.html'));
});
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Site: https://samuel-tech-games-2dj6.onrender.com`);
    console.log(`📡 API: https://samuel-tech-games-2dj6.onrender.com/api/reviews`);
});
