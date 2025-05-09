class EditorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentEditIndex = null;
        console.log('EditorController inicializado - Model:', this.model);
        console.log('Método addNews disponível:', typeof this.model.addNews === 'function');
        this.init();
    }

    async init() {
        await this.loadNews();
        this.view.bindSaveNews(this.handleSaveNews.bind(this));
        this.view.bindClearForm(this.handleClearForm.bind(this));
        this.view.bindSaveEditedNews(this.handleSaveEditedNews.bind(this));
        this.view.bindCloseEditModal(this.handleCloseEditModal.bind(this));
    }

    async loadNews() {
        try {
            const news = await this.model.getNews();
            this.view.renderNews(news, this.handleEditNews.bind(this), this.handleDeleteNews.bind(this));
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
        }
    }

    async handleSaveNews(title, content, imageFile) {
        let imageData = null;
        if (imageFile) {
            const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
            if (imageFile.size > MAX_FILE_SIZE) {
                alert('A imagem é muito grande! O tamanho máximo permitido é 1 MB. Por favor, escolha uma imagem menor.');
                return;
            }
            try {
                imageData = await this.convertImageToBase64(imageFile);
                console.log('Imagem convertida para Base64:', imageData.substring(0, 50) + '...');
            } catch (error) {
                console.error('Erro ao converter imagem para Base64:', error);
                return;
            }
        }
        const newsItem = {
            title,
            content,
            date: new Date().toISOString(),
            image: imageData,
        };
        try {
            await this.model.addNews(newsItem);
            await this.loadNews();
            this.view.clearForm();
        } catch (error) {
            console.error('Erro ao salvar notícia:', error);
        }
    }

    handleEditNews(index) {
        this.currentEditIndex = index;
        const news = this.model.getNews()[index];
        this.view.showEditModal(news);
    }

    async handleSaveEditedNews(title, content, imageFile) {
        let imageData = this.model.getNews()[this.currentEditIndex].image;
        if (imageFile) {
            const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
            if (imageFile.size > MAX_FILE_SIZE) {
                alert('A imagem é muito grande! O tamanho máximo permitido é 1 MB. Por favor, escolha uma imagem menor.');
                return;
            }
            try {
                imageData = await this.convertImageToBase64(imageFile);
                console.log('Imagem editada convertida para Base64:', imageData.substring(0, 50) + '...');
            } catch (error) {
                console.error('Erro ao converter imagem editada para Base64:', error);
                return;
            }
        }
        const updatedNews = {
            title,
            content,
            date: new Date().toISOString(),
            image: imageData,
            id: this.currentEditIndex, // Necessário para o IndexedDB
        };
        try {
            await this.model.updateNews(this.currentEditIndex, updatedNews);
            this.currentEditIndex = null;
            await this.loadNews();
            this.view.closeEditModal();
        } catch (error) {
            console.error('Erro ao atualizar notícia:', error);
        }
    }

    async handleDeleteNews(index) {
        try {
            await this.model.deleteNews(index);
            await this.loadNews();
        } catch (error) {
            console.error('Erro ao deletar notícia:', error);
        }
    }

    handleClearForm() {
        this.view.clearForm();
    }

    handleCloseEditModal() {
        this.currentEditIndex = null;
        this.view.closeEditModal();
    }

    convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
}

export default EditorController;