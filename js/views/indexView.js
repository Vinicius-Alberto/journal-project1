class IndexView {
    constructor() {
        this.newsShelf = document.getElementById('newsShelf');
        this.mainDisplay = document.querySelector('.main-display');
        this.selectedNewsId = null; // Para rastrear a notícia selecionada
        this.newsData = []; // Armazenar os dados das notícias

        console.log('Inicializando IndexView - newsShelf:', this.newsShelf);
        console.log('Inicializando IndexView - mainDisplay:', this.mainDisplay);
    }

    renderNews(news) {
        if (!this.newsShelf) {
            console.error('Elemento #newsShelf não encontrado no DOM');
            return;
        }
        this.newsData = news; // Armazena os dados
        console.log('Renderizando notícias no IndexView:', news);
        this.newsShelf.innerHTML = '';
        news.forEach((item) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('thumbnail-item');
            newsItem.setAttribute('data-id', item.id);
            if (item.id === this.selectedNewsId) {
                newsItem.classList.add('selected'); // Adiciona a classe 'selected' se for a notícia atual
            }
            newsItem.innerHTML = `
                <div class="thumbnail-image-container">
                    ${item.image ? `<img src="${item.image}" alt="Miniatura da notícia">` : '<div class="no-image">Sem Imagem</div>'}
                </div>
                <h5>${item.title}</h5>
            `;
            newsItem.addEventListener('click', () => this.onSelectNews(item.id));
            this.newsShelf.appendChild(newsItem);
        });
    }

    displaySelectedNews(news) {
        if (!this.mainDisplay) {
            console.error('Elemento .main-display não encontrado no DOM');
            return;
        }
        console.log('Exibindo notícia selecionada:', news);
        this.selectedNewsId = news.id; // Atualiza o ID da notícia selecionada
        this.mainDisplay.innerHTML = `
            <div class="selected-news">
                ${news.image ? `<img src="${news.image}" alt="Notícia expandida">` : '<div class="no-image">Sem Imagem</div>'}
                <h3>${news.title || 'Sem Título'}</h3>
                <p><strong>Data:</strong> ${news.date ? new Date(news.date).toLocaleDateString('pt-BR') : 'Sem Data'}</p>
                <p>${news.content || 'Sem Conteúdo'}</p>
            </div>
        `;
        this.renderNews(this.newsData); // Re-renderiza usando os dados armazenados
    }

    bindSelectNews(handler) {
        this.onSelectNews = handler;
    }
}

export default IndexView;