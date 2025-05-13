import EditorController from './controllers/editorControllerFirebase.js';
import EditorView from './views/editorView.js';

// Determinar a página atual
const isEditorPage = window.location.pathname.includes('editor.html');

// Função para carregar notícias no editor
async function loadEditorNewsList(editorController) {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';
    const news = await editorController.loadNews();
    if (news.length === 0) {
        newsList.innerHTML = '<p style="color: #1A1A1A;">Nenhuma notícia cadastrada.</p>';
        return;
    }
    news.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="Miniatura" class="mini-thumbnail">` : ''}
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${item.content.slice(0, 100)}${item.content.length > 100 ? '...' : ''}</p>
                <div class="actions">
                    <a href="#" data-id="${index}" class="edit-news">Editar</a>
                    <a href="#" data-id="${index}" class="delete-news">Excluir</a>
                </div>
            </div>
        `;
        newsList.appendChild(div);
    });

    // Eventos para Editar e Excluir
    document.querySelectorAll('.edit-news').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
                const id = e.target.dataset.id;
                editorController.editNews(index).then((newsItem) => {
                const editorView = new EditorView();
                editorView.populateForm(newsItem);  
                // Exibir a miniatura da imagem ao editar
                const previewImage = document.getElementById('previewImage');
                if (newsItem.image) {
                    previewImage.src = newsItem.image;
                    previewImage.style.display = 'block';
                } else {
                    previewImage.style.display = 'none';
                }
            });
        });
    });

    document.querySelectorAll('.delete-news').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.dataset.id;
            if (confirm('Deseja excluir esta notícia?')) {
                editorController.deleteNews(index).then(() => loadEditorNewsList(editorController));
            }
        });
    });
}

// Função para carregar notícias na página principal
async function loadIndexNewsList(editorController) {
    const thumbnails = document.getElementById('thumbnails');
    const mainDisplay = document.getElementById('mainDisplay');
    thumbnails.innerHTML = '';
    mainDisplay.innerHTML = '';

    const news = await editorController.loadNews();
    if (news.length === 0) {
        mainDisplay.innerHTML = '<p style="color: #1A1A1A; text-align: center;">Nenhuma notícia disponível.</p>';
        return;
    }

    news.forEach((item, index) => {
        // Criar miniatura
        const thumbnailItem = document.createElement('div');
        thumbnailItem.classList.add('thumbnail-item');
        if (index === 0) thumbnailItem.classList.add('selected');
        thumbnailItem.innerHTML = `
            <div class="thumbnail-image-container">
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="no-image">Sem Imagem</div>'}
            </div>
            <h5>${item.title}</h5>
        `;
        thumbnailItem.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('selected'));
            thumbnailItem.classList.add('selected');
            mainDisplay.innerHTML = `
                <div class="selected-news">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                    <h3>${item.title}</h3>
                    <p>Data: ${new Date(item.date).toLocaleDateString('pt-BR')}</p>
                    <p>${item.content}</p>
                </div>
            `;
        });
        thumbnails.appendChild(thumbnailItem);
    });

    // Exibir a primeira notícia por padrão
    mainDisplay.innerHTML = `
        <div class="selected-news">
            ${news[0].image ? `<img src="${news[0].image}" alt="${news[0].title}">` : ''}
            <h3>${news[0].title}</h3>
            <p>Data: ${new Date(news[0].date).toLocaleDateString('pt-BR')}</p>
            <p>${news[0].content}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const editorController = new EditorController();

    if (isEditorPage) {
        // Lógica do editor
        loadEditorNewsList(editorController);

        // Prévia da imagem
        document.getElementById('image').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const previewImage = document.getElementById('previewImage');
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImage.src = event.target.result;
                    previewImage.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.style.display = 'none';
            }
        });

        // Salvar nova notícia
        document.getElementById('newsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const imageFile = document.getElementById('image').files[0];
            let imageBase64 = '';
            if (imageFile) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(imageFile);
                });
            }
            const news = {
                title: document.getElementById('title').value,
                date: new Date().toISOString(),
                image: imageBase64,
                content: document.getElementById('content').value,
            };
            await editorController.saveNews(news);
            alert('Notícia salva com sucesso!');
            document.getElementById('newsForm').reset();
            document.getElementById('previewImage').style.display = 'none';
            loadEditorNewsList(editorController);
        });

        // Limpar formulário
        document.getElementById('clearForm').addEventListener('click', () => {
            document.getElementById('newsForm').reset();
            document.getElementById('previewImage').style.display = 'none';
        });
    } else {
        // Lógica da página principal
        loadIndexNewsList(editorController);
    }
});