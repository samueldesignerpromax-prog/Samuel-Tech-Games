// ==================== CONFIGURAÇÃO DA API ====================
const API_URL = window.location.origin + '/api/reviews';

// Buscar comentários
async function getReviews() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro');
        const data = await response.json();
        console.log('✅ Comentários carregados:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro ao buscar:', error);
        return [];
    }
}

// Salvar comentário
async function saveReview(review) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });
        const data = await response.json();
        console.log('✅ Comentário salvo:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        return null;
    }
}
