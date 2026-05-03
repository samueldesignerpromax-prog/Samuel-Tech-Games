// ==================== CONFIGURAÇÃO DA API ====================
const API_URL = 'https://samuel-tech-games-2dj6.onrender.com/api/reviews';

// Lista de Jogos
const games = [
    { id: 1, name: "Arcade Shooter Espacial", url: "https://arcade-shooter-espacial.vercel.app", icon: "fa-rocket", desc: "Nave espacial, tiros e desafios infinitos!" },
    { id: 2, name: "Escape do Labirinto Vivo", url: "https://escape-do-labirinto-vivo.vercel.app", icon: "fa-dragon", desc: "Labirinto que se transforma em tempo real!" },
    { id: 3, name: "Ninja Dojo", url: "https://ninja-dojo-eta.vercel.app", icon: "fa-user-ninja", desc: "Ação platformer com chefões desafiadores!" },
    { id: 4, name: "Desvie dos Obstáculos", url: "https://desvie-dos-obstaculos.vercel.app", icon: "fa-car", desc: "Corrida infinita com obstáculos!" },
    { id: 5, name: "Pulo Infinito", url: "https://pulo-infinito.vercel.app", icon: "fa-bounce", desc: "Pule sem parar e ganhe pontos!" },
    { id: 6, name: "Asteroid 3.0", url: "https://asteroid-3-0.vercel.app", icon: "fa-meteor", desc: "Destrua asteroides no espaço!" },
    { id: 7, name: "Game Snake 3.0", url: "https://game-snake-3-0.vercel.app", icon: "fa-snake", desc: "O clássico Snake com visual moderno!" }
];

// ==================== FUNÇÕES DA API ====================
async function getReviews() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error('Erro na API');
        const dados = await resposta.json();
        console.log('✅ Comentários carregados:', dados.length);
        return dados;
    } catch (erro) {
        console.error('❌ Erro:', erro);
        return [];
    }
}

async function saveReview(review) {
    try {
        // Garantir que tem id único
        const novoReview = {
            ...review,
            id: Date.now(),
            date: new Date().toISOString()
        };
        
        console.log('📤 Enviando:', novoReview);
        
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoReview)
        });
        
        if (!resposta.ok) throw new Error('Erro ao salvar');
        
        const dados = await resposta.json();
        console.log('✅ Salvo!', dados);
        return dados;
        
    } catch (erro) {
        console.error('❌ Erro detalhado:', erro);
        alert('Erro ao salvar. Tente novamente.');
        return null;
    }
}

// ==================== RENDERIZAÇÃO DOS JOGOS ====================
function renderGames() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = games.map(game => `
        <div class="game-card">
            <i class="fas ${game.icon}"></i>
            <h3>${game.name}</h3>
            <p>${game.desc}</p>
            <a href="${game.url}" target="_blank" class="play-btn">🎮 Jogar Agora</a>
        </div>
    `).join('');
}

function renderHighlights() {
    const grid = document.getElementById('highlightsGrid');
    if (!grid) return;
    const highlights = games.slice(0, 3);
    grid.innerHTML = highlights.map(game => `
        <div class="highlight-card">
            <i class="fas ${game.icon}"></i>
            <h4>${game.name}</h4>
            <p>${game.desc}</p>
        </div>
    `).join('');
}

function renderGameSelect() {
    const select = document.getElementById('reviewGameSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione um jogo</option>' +
        games.map(game => `<option value="${game.id}">${game.name}</option>`).join('');
}

// ==================== EXIBIR COMENTÁRIOS ====================
async function renderReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    
    const reviews = await getReviews();
    
    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#aaa;">⭐ Seja o primeiro a avaliar um jogo!</p>';
        return;
    }
    
    container.innerHTML = [...reviews].reverse().map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-game">${review.gameName}</span>
                <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
            </div>
            <div class="review-author">${review.author || 'Anônimo'}</div>
            <div class="review-comment">${review.comment}</div>
            <div class="review-date">${new Date(review.date).toLocaleDateString('pt-BR')}</div>
        </div>
    `).join('');
}

// ==================== ESTATÍSTICAS ====================
async function loadStats() {
    const reviews = await getReviews();
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;
    
    const avgEl = document.getElementById('avgRating');
    const totalEl = document.getElementById('totalReviews');
    if (avgEl) avgEl.textContent = avg;
    if (totalEl) totalEl.textContent = total;
}

// ==================== FORMULÁRIO ====================
let selectedRating = 0;

function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('active');
                    s.style.color = '#ffcc00';
                } else {
                    s.classList.remove('active');
                    s.style.color = '#555';
                }
            });
        });
    });
}

async function submitReview() {
    const gameId = document.getElementById('reviewGameSelect')?.value;
    const author = document.getElementById('reviewAuthor')?.value.trim();
    const comment = document.getElementById('reviewComment')?.value.trim();
    
    if (!gameId) { alert('Selecione um jogo!'); return; }
    if (!selectedRating) { alert('Selecione uma nota!'); return; }
    if (!comment) { alert('Escreva um comentário!'); return; }
    
    const game = games.find(g => g.id == gameId);
    
    const novoReview = {
        gameId: parseInt(gameId),
        gameName: game.name,
        rating: selectedRating,
        author: author || 'Anônimo',
        comment: comment
    };
    
    const salvo = await saveReview(novoReview);
    
    if (salvo) {
        alert('✅ Avaliação enviada com sucesso!');
        document.getElementById('reviewAuthor').value = '';
        document.getElementById('reviewComment').value = '';
        document.getElementById('reviewGameSelect').value = '';
        selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('active');
            s.style.color = '#555';
        });
        await renderReviews();
        await loadStats();
    }
}

// ==================== CONTATO ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('📧 Mensagem enviada! Em breve entrarei em contato.');
        form.reset();
    });
}

// ==================== EFEITO MATRIX ====================
function createMatrixEffect() {
    if (document.getElementById('matrix-canvas')) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const chars = "01";
    const fontSize = 14;
    let drops = [];
    
    function init() {
        const cols = Math.floor(canvas.width / fontSize);
        drops = Array(cols).fill(0).map(() => Math.random() * -100);
    }
    
    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ffff";
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    
    init();
    window.addEventListener('resize', init);
    function animate() { draw(); requestAnimationFrame(animate); }
    animate();
}

// ==================== WHATSAPP ====================
function addWhatsAppButton() {
    if (document.getElementById('whatsapp-button')) return;
    const btn = document.createElement('a');
    btn.id = 'whatsapp-button';
    btn.href = 'https://wa.me/5511913031275';
    btn.target = '_blank';
    btn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    btn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #25D366; color: white; width: 60px; height: 60px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 32px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 1000; transition: all 0.3s; text-decoration: none;
    `;
    document.body.appendChild(btn);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Site iniciado!');
    renderGames();
    renderHighlights();
    renderGameSelect();
    setupStarRating();
    setupContactForm();
    await renderReviews();
    await loadStats();
    createMatrixEffect();
    addWhatsAppButton();
    
    const submitBtn = document.getElementById('submitReview');
    if (submitBtn) submitBtn.addEventListener('click', submitReview);
    
    const exploreBtn = document.getElementById('exploreGamesBtn');
    if (exploreBtn) exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'games.html';
    });
});
