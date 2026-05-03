const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router('db.json');

// Middlewares
app.use(express.json());
app.use(express.static(__dirname)); // Serve arquivos estáticos (CSS, JS, etc.)

// Rota da API (deve vir antes das rotas do site)
app.use('/api/reviews', router);

// Rota principal - serve o SITE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas para as outras páginas do site
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

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Site: https://samuel-tech-games-2dj6.onrender.com`);
    console.log(`📡 API: https://samuel-tech-games-2dj6.onrender.com/api/reviews`);
});
