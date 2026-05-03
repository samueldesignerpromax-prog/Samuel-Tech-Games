const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// ==================== CONEXÃO COM MONGODB ====================
const MONGODB_URI = 'mongodb+srv://Samuel:VLOXWvBEymBEe0wG@cluster0.af6fbu4.mongodb.net/samuel_tech_games?retryWrites=true&w=majority';

// Schema do comentário
const reviewSchema = new mongoose.Schema({
    gameId: { type: Number, required: true },
    gameName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: String, default: 'Anônimo' },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// Conectar ao MongoDB com opções extras
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
.catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    console.log('⚠️ Continuando sem banco de dados...');
});

// ==================== MIDDLEWARES ====================
app.use(express.json());
app.use(express.static(__dirname));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ==================== API DE COMENTÁRIOS ====================

// GET - Buscar todos os comentários
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        console.log(`📖 Buscados ${reviews.length} comentários`);
        res.json(reviews);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.json([]);
    }
});

// POST - Adicionar novo comentário
app.post('/api/reviews', async (req, res) => {
    try {
        console.log('📝 Recebendo comentário:', req.body);
        
        // Validar dados
        if (!req.body.gameName || !req.body.rating || !req.body.comment) {
            return res.status(400).json({ erro: 'Dados incompletos' });
        }
        
        const newReview = new Review({
            gameId: req.body.gameId,
            gameName: req.body.gameName,
            rating: req.body.rating,
            author: req.body.author || 'Anônimo',
            comment: req.body.comment
        });
        
        const saved = await newReview.save();
        console.log('✅ Comentário salvo no MongoDB!', saved);
        res.status(201).json(saved);
        
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        res.status(500).json({ erro: error.message });
    }
});

// ==================== ROTAS DO SITE ====================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/games.html', (req, res) => res.sendFile(path.join(__dirname, 'games.html')));
app.get('/reviews.html', (req, res) => res.sendFile(path.join(__dirname, 'reviews.html')));
app.get('/about.html', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Site: https://samuel-tech-games-2dj6.onrender.com`);
    console.log(`📡 API: https://samuel-tech-games-2dj6.onrender.com/api/reviews`);
});
