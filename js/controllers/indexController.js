class IndexController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        console.log('IndexController inicializado - Model:', this.model);
        console.log('Método getNews disponível:', typeof this.model.getNews === 'function');
        this.init();
    }

    async init() {
        await this.loadNews();
        this.view.bindOpenModal(this.handleOpenModal.bind(this));
        this.view.bindCloseModal(this.handleCloseModal.bind(this));
    }

    async loadNews() {
        try {
            const news = await this.model.getNews();
            console.log('Notícias carregadas no IndexController:', news);
            this.view.renderNews(news);
        } catch (error) {
            console.error('Erro ao carregar notícias no IndexController:', error);
        }
    }

    handleOpenModal(index) {
        const news = this.model.getNews()[index];
        this.view.showModal(news);
    }

    handleCloseModal() {
        this.view.closeModal();
    }
}

export default IndexController;