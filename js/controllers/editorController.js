class EditorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        // Renderiza notícias iniciais
        this.view.renderNews(this.model.getNews(), this.handleEdit.bind(this), this.handleDelete.bind(this));

        // Adiciona eventos aos botões
        this.view.bindSaveNews(this.handleSaveNews.bind(this));
        this.view.bindClearForm(this.handleClearForm.bind(this));
        this.view.bindCloseEditModal(this.handleCloseEditModal.bind(this));
    }

    handleSaveNews(newsData) {
        this.model.saveNews(newsData);
        this.view.renderNews(this.model.getNews(), this.handleEdit.bind(this), this.handleDelete.bind(this));
        this.view.clearForm();
    }

    handleClearForm() {
        this.view.clearForm();
    }

    handleEdit(index) {
        const newsItem = this.model.getNews()[index];
        this.view.openEditModal(newsItem);
        this.view.bindSaveEditedNews(this.handleSaveEditedNews.bind(this), index);
    }

    handleSaveEditedNews(index, updatedNews) {
        const existingNews = this.model.getNews()[index];
        updatedNews.views = existingNews.views || 0;
        updatedNews.image = updatedNews.image || existingNews.image;
        this.model.updateNews(index, updatedNews);
        this.view.renderNews(this.model.getNews(), this.handleEdit.bind(this), this.handleDelete.bind(this));
        this.view.closeEditModal();
    }

    handleDelete(index) {
        this.model.deleteNews(index);
        this.view.renderNews(this.model.getNews(), this.handleEdit.bind(this), this.handleDelete.bind(this));
    }

    handleCloseEditModal() {
        this.view.closeEditModal();
    }
}

export default EditorController;