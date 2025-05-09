class IndexView {
    constructor() {
        this.newsList = document.getElementById('newsList');
        this.modal = document.getElementById('newsModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDate = document.getElementById('modalDate');
        this.modalImage = document.getElementById('modalImage');
        this.modalContent = document.getElementById('modalContent');
        this.closeModalBtn = document.getElementById('closeModal');
    }

    // Renderiza a lista de notícias como miniaturas
    renderNews(news, onClickHandler) {
        if (!this.newsList) {
            console.error('Elemento #newsList não encontrado no DOM');
            return;
        }
        this.newsList.innerHTML = '';
        news.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-book');
            newsItem.innerHTML = `
                <div class="book-cover">
                    ${item.image ? `<img src="${item.image}" alt="Capa da notícia">` : '<div class="no-image">Sem Imagem</div>'}
                    <h4>${item.title}</h4>
                </div>
            `;
            newsItem.addEventListener('click', () => onClickHandler(index));
            this.newsList.appendChild(newsItem);
        });
    }

    // Exibe o modal com os detalhes da notícia
    showNewsDetails(news) {
        if (!this.modal || !this.modalTitle || !this.modalContent) {
            console.error('Elementos do modal não encontrados no DOM');
            return;
        }
        this.modalTitle.textContent = news.title;
        this.modalDate.textContent = `Data: ${new Date(news.date).toLocaleDateString('pt-BR')}`;
        this.modalContent.textContent = news.content;
        if (news.image) {
            this.modalImage.src = news.image;
            this.modalImage.style.display = 'block';
        } else {
            this.modalImage.style.display = 'none';
        }
        this.modal.style.display = 'block';

        // Fecha o modal ao clicar no botão de fechar
        this.closeModalBtn.onclick = () => {
            this.modal.style.display = 'none';
        };

        // Fecha o modal ao clicar fora do conteúdo
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        };
    }
}

export default IndexView;