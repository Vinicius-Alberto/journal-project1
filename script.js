console.log("script.js carregado com sucesso!");

// Carrega notícias do localStorage ou inicia vazio
let news = JSON.parse(localStorage.getItem('news')) || [];
let filteredNews = news;
let selectedNewsId = null; // ID da notícia em destaque

// Função para salvar notícias no localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('news', JSON.stringify(news));
        console.log("Notícias salvas no localStorage:", news);
    } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
    }
}

// Função para preencher o seletor de datas
function populateDateFilter() {
    const dateFilter = document.getElementById('dateFilter');
    if (!dateFilter) return;

    const dates = [...new Set(news.map(item => item.date))].sort().reverse();
    dateFilter.innerHTML = '<option value="">Todas as datas</option>';
    dates.forEach(date => {
        dateFilter.innerHTML += `<option value="${date}">${date}</option>`;
    });
}

// Função para filtrar notícias por data
function filterNewsByDate() {
    const dateFilter = document.getElementById('dateFilter');
    if (!dateFilter) return;

    const selectedDate = dateFilter.value;
    filteredNews = selectedDate ? news.filter(item => item.date === selectedDate) : news;
    selectedNewsId = null; // Reseta seleção ao mudar filtro
    displayNews();
}

// Função para redimensionar imagem
function resizeImage(file, maxWidth, maxHeight, callback) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.8));
        };
    };
    reader.readAsDataURL(file);
}

// Função para exibir notícias e imagem no canvas (index.html)
function displayNews() {
    console.log("Exibindo notícias");
    const canvas = document.getElementById('newspaperCanvas');
    const newsList = document.getElementById('newsList');
    if (!canvas || !newsList) {
        console.log("Canvas ou newsList não encontrado");
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Exibe a imagem da notícia selecionada ou a primeira da data
    const newsToShow = selectedNewsId
        ? filteredNews.find(item => item.id === selectedNewsId)
        : filteredNews[0];

    if (newsToShow && newsToShow.image) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = () => {
            console.log("Erro ao carregar imagem");
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Imagem não disponível', canvas.width / 2, canvas.height / 2);
        };
        img.src = newsToShow.image;
    } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhuma imagem disponível', canvas.width / 2, canvas.height / 2);
    }

    // Exibe metadados das notícias
    newsList.innerHTML = '';
    if (filteredNews.length === 0) {
        newsList.innerHTML = '<p>Nenhuma notícia disponível.</p>';
        return;
    }
    filteredNews.forEach(item => {
        newsList.innerHTML += `
            <div class="news-item" onclick="selectNews(${item.id})">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.content.substring(0, 100)}...</p>
                    <p>Data: ${item.date}</p>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
            </div>
        `;
    });
}

// Função para selecionar notícia em destaque (index.html)
function selectNews(id) {
    console.log("Notícia selecionada para destaque:", id);
    selectedNewsId = id;
    displayNews();
}

// Função para salvar notícia (editor.html)
function saveNews() {
    console.log("Botão Salvar Notícia clicado!");
    const titleElement = document.getElementById('newsTitle');
    const contentElement = document.getElementById('newsContent');
    const imageElement = document.getElementById('newsImage');

    if (!titleElement || !contentElement || !imageElement) {
        console.error("Elementos newsTitle, newsContent ou newsImage não encontrados");
        return;
    }

    const title = titleElement.value;
    const content = contentElement.value;

    if (!title || !content) {
        alert('Por favor, preencha o título e o conteúdo.');
        return;
    }

    const newNews = {
        id: news.length ? Math.max(...news.map(n => n.id)) + 1 : 1,
        title,
        content,
        date: new Date().toISOString().split('T')[0]
    };

    if (imageElement.files[0]) {
        resizeImage(imageElement.files[0], 800, 600, (dataUrl) => {
            newNews.image = dataUrl;
            news.push(newNews);
            saveToLocalStorage();
            clearForm();
            displayEditorNews();
        });
    } else {
        newNews.image = '';
        news.push(newNews);
        saveToLocalStorage();
        clearForm();
        displayEditorNews();
    }
}

// Função para limpar o formulário (editor.html)
function clearForm() {
    console.log("Botão Limpar clicado!");
    const titleElement = document.getElementById('newsTitle');
    const contentElement = document.getElementById('newsContent');
    const imageElement = document.getElementById('newsImage');

    if (titleElement && contentElement && imageElement) {
        titleElement.value = '';
        contentElement.value = '';
        imageElement.value = '';
    }
}

// Função para exibir notícias no editor (editor.html)
function displayEditorNews() {
    console.log("Exibindo notícias no editor");
    const editorNewsList = document.getElementById('editorNewsList');
    if (!editorNewsList) return;

    editorNewsList.innerHTML = '';
    if (news.length === 0) {
        editorNewsList.innerHTML = '<p>Nenhuma notícia disponível.</p>';
        return;
    }
    news.forEach(item => {
        editorNewsList.innerHTML += `
            <div class="news-item">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.content.substring(0, 50)}...</p>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                <button class="edit" onclick="openEditModal(${item.id})">Editar</button>
                <button class="delete" onclick="deleteNews(${item.id})">Excluir</button>
            </div>
        `;
    });
}

// Função para excluir notícia (editor.html)
function deleteNews(id) {
    console.log("Excluindo notícia ID:", id);
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
        news = news.filter(item => item.id !== id);
        saveToLocalStorage();
        displayEditorNews();
    }
}

// Função para abrir o modal de edição (editor.html)
function openEditModal(id) {
    console.log("Abrindo modal de edição para ID:", id);
    const newsItem = news.find(item => item.id === id);
    if (!newsItem) {
        console.error("Notícia não encontrada para ID:", id);
        return;
    }

    const editTitle = document.getElementById('editTitle');
    const editContent = document.getElementById('editContent');
    const editImage = document.getElementById('editImage');
    editTitle.value = newsItem.title;
    editContent.value = newsItem.content;
    editImage.value = '';
    editTitle.dataset.newsId = id;

    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
}

// Função para salvar notícia editada (editor.html)
function saveEditedNews() {
    console.log("Botão Salvar (modal) clicado!");
    const editTitle = document.getElementById('editTitle');
    const editContent = document.getElementById('editContent');
    const editImage = document.getElementById('editImage');
    const newsId = parseInt(editTitle.dataset.newsId);

    if (!editTitle.value || !editContent.value) {
        alert('Por favor, preencha o título e o conteúdo.');
        return;
    }

    const updatedNews = {
        id: newsId,
        title: editTitle.value,
        content: editContent.value,
        date: news.find(item => item.id === newsId).date
    };

    if (editImage.files[0]) {
        resizeImage(editImage.files[0], 800, 600, (dataUrl) => {
            updatedNews.image = dataUrl;
            news = news.map(item => item.id === newsId ? updatedNews : item);
            saveToLocalStorage();
            displayEditorNews();
            closeEditModal();
        });
    } else {
        updatedNews.image = news.find(item => item.id === newsId).image || '';
        news = news.map(item => item.id === newsId ? updatedNews : item);
        saveToLocalStorage();
        displayEditorNews();
        closeEditModal();
    }
}

// Função para fechar o modal (editor.html)
function closeEditModal() {
    console.log("Fechando modal");
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    document.getElementById('editTitle').value = '';
    document.getElementById('editContent').value = '';
    document.getElementById('editImage').value = '';
    delete document.getElementById('editTitle').dataset.newsId;
}

// Função para destacar o link da página atual
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('header nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Inicializar a página
if (document.getElementById('newspaperCanvas')) {
    console.log("Página inicial detectada");
    populateDateFilter();
    displayNews();
}
if (document.getElementById('editorNewsList')) {
    console.log("Página do editor detectada");
    displayEditorNews();
}
setActiveNavLink();