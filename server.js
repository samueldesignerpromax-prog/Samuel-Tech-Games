// ==================== CONFIGURAÇÃO DA API ====================
// URL absoluta da API no Render
const API_URL = 'https://samuel-tech-games-2dj6.onrender.com/api/reviews';

// Buscar comentários da API
async function getReviews() {
    try {
        console.log('🔍 Buscando comentários em:', API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Comentários carregados:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro ao buscar comentários:', error);
        return [];
    }
}

// Salvar comentário na API
async function saveReview(review) {
    try {
        console.log('📤 Enviando comentário:', review);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Comentário salvo:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        alert('Erro ao salvar comentário. Tente novamente.');
        return null;
    }
}
