class EditorView {
    constructor() {
        this.newsList = document.getElementById('editorNewsList');
        this.newsTitle = document.getElementById('newsTitle');
        this.newsContent = document.getElementById('newsContent');
        this.newsImage = document.getElementById('newsImage');
        this.editModal = document.getElementById('editModal');
        this.editTitle = document.getElementById('editTitle');
        this.editContent = document.getElementById('editContent');
        this.editImage = document.getElementById('editImage');
    }

    // Renderiza a lista de notícias no editor
    renderNews(news, onEditHandler, onDeleteHandler) {
        this.newsList.innerHTML = '';
        news.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                    <p>Data: ${new Date(item.date).toLocaleDateString('pt-BR')} | Visualizações: ${item.views || 0}</p>
                </div>
                ${item.image ? `<img src="${item.image}" alt="Imagem da notícia">` : ''}
                <div>
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="delete" data-index="${index}">Excluir</button>
                </div>
            `;
            this.newsList.appendChild(newsItem);
        });

        // Adiciona eventos aos botões
        this.newsList.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                onEditHandler(index);
            });
        });

        this.newsList.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                onDeleteHandler(index);
            });
        });
    }

    // Obtém os dados do formulário
    getFormData() {
        const imageFile = this.newsImage.files[0];
        let imageData = null;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            return new Promise(resolve => {
                reader.onload = () => {
                    imageData = reader.result;
                    resolve({
                        title: this.newsTitle.value,
                        content: this.newsContent.value,
                        image: imageData,
                        date: new Date().toISOString(),
                        views: 0
                    });
                };
            });
        }
        return Promise.resolve({
            title: this.newsTitle.value,
            content: this.newsContent.value,
            image: null,
            date: new Date().toISOString(),
            views: 0
        });
    }

    // Limpa o formulário
    clearForm() {
        this.newsTitle.value = '';
        this.newsContent.value = '';
        this.newsImage.value = '';
    }

    // Abre o modal de edição
    openEditModal(newsItem) {
        this.editTitle.value = newsItem.title;
        this.editContent.value = newsItem.content;
        this.editImage.value = ''; // Não podemos pré-preencher input de arquivo
        this.editModal.style.display = 'block';
    }

    // Fecha o modal de edição
    closeEditModal() {
        this.editModal.style.display = 'none';
    }

    // Obtém os dados do modal de edição
    getEditFormData() {
        const imageFile = this.editImage.files[0];
        let imageData = null;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            return new Promise(resolve => {
                reader.onload = () => {
                    imageData = reader.result;
                    resolve({
                        title: this.editTitle.value,
                        content: this.editContent.value,
                        image: imageData,
                        date: new Date().toISOString(),
                        views: 0
                    });
                };
            });
        }
        return Promise.resolve({
            title: this.editTitle.value,
            content: this.editContent.value,
            image: null,
            date: new Date().toISOString(),
            views: 0
        });
    }

    // Adiciona eventos aos botões do formulário e modal
    bindSaveNews(handler) {
        document.querySelector('.editor-form button:first-of-type').addEventListener('click', async () => {
            const newsData = await this.getFormData();
            handler(newsData);
        });
    }

    bindClearForm(handler) {
        document.querySelector('.editor-form button:last-of-type').addEventListener('click', () => {
            handler();
        });
    }

    bindSaveEditedNews(handler, index) {
        const saveButton = document.querySelector('#editModal button:first-of-type');
        saveButton.onclick = async () => {
            const updatedNews = await this.getEditFormData();
            handler(index, updatedNews);
        };
    }

    bindCloseEditModal(handler) {
        document.querySelector('#editModal button:last-of-type').addEventListener('click', () => {
            handler();
        });
    }
}

export default EditorView;