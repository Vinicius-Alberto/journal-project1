export default class EditorController {
    constructor() {
        this.dbName = 'NewsDB';
        this.storeName = 'news';
        this.db = null;
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => reject('Erro ao abrir o banco de dados');
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, { autoIncrement: true });
            };
        });
    }

    async saveNews(news) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(news);
            request.onsuccess = () => resolve();
            request.onerror = () => reject('Erro ao salvar notícia');
        });
    }

    async loadNews() {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Erro ao carregar notícias');
        });
    }

    async editNews(index) {
        const news = await this.loadNews();
        if (index >= 0 && index < news.length) {
            const newsItem = news[index];
            await this.deleteNews(index);
            return newsItem;
        }
        throw new Error('Notícia não encontrada');
    }

    async deleteNews(index) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();
            request.onsuccess = () => {
                const keys = request.result;
                if (index >= 0 && index < keys.length) {
                    const deleteRequest = store.delete(keys[index]);
                    deleteRequest.onsuccess = () => resolve();
                    deleteRequest.onerror = () => reject('Erro ao excluir notícia');
                } else {
                    reject('Índice inválido');
                }
            };
            request.onerror = () => reject('Erro ao obter chaves');
        });
    }
}