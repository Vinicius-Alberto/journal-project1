document.addEventListener('DOMContentLoaded', async () => {
    // Pequeno atraso para garantir que o DOM esteja completamente carregado
    await new Promise(resolve => setTimeout(resolve, 100));

    // Importa módulos dinamicamente
    const { default: NewsModel } = await import('./models/newsModel.js');
    const model = new NewsModel();
    console.log('NewsModel instanciado:', model); // Log para depuração

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage.includes('index.html') || currentPage === '') {
        const { default: IndexView } = await import('./views/indexView.js');
        const view = new IndexView();
        try {
            const { default: IndexController } = await import('./controllers/indexController.js');
            new IndexController(model, view);
        } catch (error) {
            console.error('Erro ao importar IndexController:', error);
        }
    } else if (currentPage.includes('editor.html')) {
        const { default: EditorView } = await import('./views/editorView.js');
        const { default: EditorController } = await import('./controllers/editorController.js');
        const view = new EditorView();
        await new Promise(resolve => setTimeout(resolve, 100));
        new EditorController(model, view);
    }

    console.log('Aplicativo inicializado com sucesso!');
});