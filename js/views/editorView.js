class EditorView {
    constructor() {
        this.newsList = document.getElementById('editorNewsList');
        this.newsTitle = document.getElementById('newsTitle');
        this.newsContent = document.getElementById('newsContent');
        this.newsImage = document.getElementById('newsImage');
        this.saveButton = document.querySelector('.save-news-btn');
        this.clearButton = document.querySelector('.clear-form-btn');
        this.editModal = document.getElementById('editModal');
        this.editTitle = document.getElementById('editTitle');
        this.editContent = document.getElementById('editContent');
        this.editImage = document.getElementById('editImage');
        this.saveEditButton = document.querySelector('.save-edit-btn');
        this.cancelEditButton = document.querySelector('.cancel-edit-btn');

        // Log para depuração
        console.log('Botão Salvar Notícia:', this.saveButton);
        console.log('Botão Limpar:', this.clearButton);
        console.log('Botão Salvar Edição:', this.saveEditButton);
        console.log('Botão Cancelar Edição:', this.cancelEditButton);
    }

    renderNews(news, onEditHandler, onDeleteHandler) {
        if (!this.newsList) {
            console.error('Elemento #editorNewsList não encontrado no DOM');
            return;
        }
        this.newsList.innerHTML = '';
        news.forEach((item, index) => {
            console.log('Renderizando notícia - Imagem:', item.image ? item.image.substring(0, 50) + '...' : 'Nenhuma imagem');
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                    <p>Data: ${new Date(item.date).toLocaleDateString('pt-BR')}</p>
                </div>
                ${item.image ? `<img src="${item.image}" alt="Imagem da notícia" class="news-image">` : ''}
                <div class="news-actions">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;
            newsItem.querySelector('.edit-btn').addEventListener('click', () => onEditHandler(index));
            newsItem.querySelector('.delete-btn').addEventListener('click', () => onDeleteHandler(index));
            this.newsList.appendChild(newsItem);
        });
    }

    clearForm() {
        if (this.newsTitle) this.newsTitle.value = '';
        if (this.newsContent) this.newsContent.value = '';
        if (this.newsImage) this.newsImage.value = '';
    }

    showEditModal(news) {
        if (!this.editModal) {
            console.error('Elemento #editModal não encontrado no DOM');
            return;
        }
        if (this.editTitle) this.editTitle.value = news.title;
        if (this.editContent) this.editContent.value = news.content;
        if (this.editImage) this.editImage.value = '';
        this.editModal.style.display = 'block';
    }

    closeEditModal() {
        if (this.editModal) this.editModal.style.display = 'none';
    }

    bindSaveNews(handler) {
        if (!this.saveButton) {
            console.error('Botão de salvar notícia não encontrado');
            return;
        }
        this.saveButton.addEventListener('click', () => {
            const title = this.newsTitle ? this.newsTitle.value.trim() : '';
            const content = this.newsContent ? this.newsContent.value.trim() : '';
            const imageFile = this.newsImage && this.newsImage.files.length > 0 ? this.newsImage.files[0] : null;
            console.log('Salvando notícia - Imagem:', imageFile);
            if (title && content) {
                handler(title, content, imageFile);
            } else {
                alert('Por favor, preencha o título e o conteúdo.');
            }
        });
    }

    bindClearForm(handler) {
        if (!this.clearButton) {
            console.error('Botão de limpar não encontrado');
            return;
        }
        this.clearButton.addEventListener('click', () => {
            handler();
        });
    }

    bindSaveEditedNews(handler) {
        if (!this.saveEditButton) {
            console.error('Botão de salvar edição não encontrado');
            return;
        }
        this.saveEditButton.addEventListener('click', () => {
            const title = this.editTitle ? this.editTitle.value.trim() : '';
            const content = this.editContent ? this.editContent.value.trim() : '';
            const imageFile = this.editImage && this.editImage.files.length > 0 ? this.editImage.files[0] : null;
            console.log('Salvando edição - Imagem:', imageFile);
            if (title && content) {
                handler(title, content, imageFile);
            } else {
                alert('Por favor, preencha o título e o conteúdo.');
            }
        });
    }

    bindCloseEditModal(handler) {
        if (!this.cancelEditButton) {
            console.error('Botão de cancelar edição não encontrado');
            return;
        }
        this.cancelEditButton.addEventListener('click', () => {
            handler();
        });
    }
}

export default EditorView;