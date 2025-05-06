class NewsModel {
    constructor() {
        this.news = JSON.parse(localStorage.getItem('news')) || [];
    }

    // Salva uma nova notícia
    saveNews(newsItem) {
        this.news.push(newsItem);
        this._updateStorage();
    }

    // Obtém todas as notícias
    getNews() {
        return this.news;
    }

    // Obtém notícias filtradas por data
    getNewsByDate(date) {
        if (!date) return this.news;
        return this.news.filter(item => new Date(item.date).toDateString() === new Date(date).toDateString());
    }

    // Atualiza uma notícia existente
    updateNews(index, updatedNews) {
        this.news[index] = updatedNews;
        this._updateStorage();
    }

    // Deleta uma notícia
    deleteNews(index) {
        this.news.splice(index, 1);
        this._updateStorage();
    }

    // Incrementa visualizações de uma notícia
    incrementViews(index) {
        this.news[index].views = (this.news[index].views || 0) + 1;
        this._updateStorage();
    }

    // Atualiza o localStorage
    _updateStorage() {
        localStorage.setItem('news', JSON.stringify(this.news));
    }
}

export default NewsModel;