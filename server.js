const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middlewares
app.use(middlewares);
app.use(express.json());
app.use(express.static(__dirname));

// CORS para liberar acesso
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API - Rotas de comentários
app.use('/api/reviews', router);

// Rota principal para o site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas das páginas
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
    console.log(`✅ Site e API rodando na porta ${PORT}`);
    console.log(`📝 Site: https://samuel-tech-games.onrender.com`);
    console.log(`📝 API: https://samuel-tech-games.onrender.com/api/reviews`);
});
