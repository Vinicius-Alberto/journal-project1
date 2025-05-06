(async () => {
    // Carrega Chart.js dinamicamente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'; // Versão específica para evitar warnings
    script.onload = () => console.log('Chart.js carregado com sucesso!');
    document.head.appendChild(script);

    // Aguarda um curto período para garantir que o Chart.js esteja carregado
    await new Promise(resolve => setTimeout(resolve, 100));

    // Importa módulos dinamicamente
    const { default: NewsModel } = await import('./models/newsModel.js');
    const model = new NewsModel();

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage.includes('index.html') || currentPage === '') {
        const { default: IndexView } = await import('./views/indexView.js');
        const { default: IndexController } = await import('./controllers/indexController.js');
        const view = new IndexView();
        new IndexController(model, view);
    } else if (currentPage.includes('editor.html')) {
        const { default: EditorView } = await import('./views/editorView.js');
        const { default: EditorController } = await import('./controllers/editorController.js');
        const view = new EditorView();
        new EditorController(model, view);
    }

    console.log('Aplicativo inicializado com sucesso!');
})();