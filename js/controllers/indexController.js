class IndexController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        // Renderiza notícias iniciais
        this.view.renderNews(this.model.getNews(), this.handleNewsClick.bind(this));
        this.view.renderChart(this.model.getNews());

        // Adiciona evento ao filtro de data
        this.view.bindFilterChange(date => {
            const filteredNews = this.model.getNewsByDate(date);
            this.view.renderNews(filteredNews, this.handleNewsClick.bind(this));
            this.view.renderChart(filteredNews);
        });
    }

    handleNewsClick(index) {
        this.model.incrementViews(index);
        this.view.renderNews(this.model.getNews(), this.handleNewsClick.bind(this));
        this.view.renderChart(this.model.getNews());
    }
}

export default IndexController;