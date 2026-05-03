const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

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

// ==================== API DE COMENTÁRIOS (MANUAL) ====================
const DB_FILE = path.join(__dirname, 'db.json');

// Ler comentários
function getReviews() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const json = JSON.parse(data);
        return json.reviews || [];
    } catch (error) {
        return [];
    }
}

// Salvar comentários
function saveReviews(reviews) {
    try {
        const data = { reviews: reviews };
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// GET - Buscar todos os comentários
app.get('/api/reviews', (req, res) => {
    const reviews = getReviews();
    res.json(reviews);
});

// POST - Adicionar novo comentário
app.post('/api/reviews', (req, res) => {
    try {
        const newReview = req.body;
        
        // Validar dados
        if (!newReview.gameName || !newReview.rating || !newReview.comment) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        // Adicionar ID único e data
        newReview.id = Date.now();
        newReview.date = new Date().toISOString();
        
        // Salvar
        const reviews = getReviews();
        reviews.push(newReview);
        saveReviews(reviews);
        
        console.log('✅ Comentário salvo:', newReview);
        res.status(201).json(newReview);
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        res.status(500).json({ erro: 'Erro interno' });
    }
});

// DELETE - Deletar comentário (opcional)
app.delete('/api/reviews/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let reviews = getReviews();
    reviews = reviews.filter(r => r.id !== id);
    saveReviews(reviews);
    res.json({ mensagem: 'Comentário deletado' });
});

// ==================== ROTAS DO SITE ====================
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

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Site: https://samuel-tech-games-2dj6.onrender.com`);
    console.log(`📡 API: https://samuel-tech-games-2dj6.onrender.com/api/reviews`);
});
