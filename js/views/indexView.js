class IndexView {
    constructor() {
        this.newsList = document.getElementById('newsList');
        this.dateFilter = document.getElementById('dateFilter');
        this.viewsChart = document.getElementById('viewsChart').getContext('2d');
    }

    // Renderiza a lista de notícias
    renderNews(news, onClickHandler) {
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
            `;
            newsItem.addEventListener('click', () => onClickHandler(index));
            this.newsList.appendChild(newsItem);
        });
    }

    // Renderiza o gráfico de visualizações
    renderChart(news) {
        const dates = [...new Set(news.map(item => new Date(item.date).toLocaleDateString('pt-BR')))];
        const viewsData = dates.map(date => {
            return news.reduce((sum, item) => {
                if (new Date(item.date).toLocaleDateString('pt-BR') === date) {
                    return sum + (item.views || 0);
                }
                return sum;
            }, 0);
        });

        new Chart(this.viewsChart, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Visualizações por Data',
                    data: viewsData,
                    borderColor: 'rgba(0, 48, 135, 1)',
                    backgroundColor: 'rgba(0, 48, 135, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Obtém a data do filtro
    getFilterDate() {
        return this.dateFilter.value;
    }

    // Adiciona listener para o filtro de data
    bindFilterChange(handler) {
        this.dateFilter.addEventListener('change', () => {
            handler(this.getFilterDate());
        });
    }
}

export default IndexView;