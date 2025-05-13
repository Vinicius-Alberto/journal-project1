export default class EditorView {
    populateForm(newsItem) {
        document.getElementById('title').value = newsItem.title;
        document.getElementById('content').value = newsItem.content;
        // Imagem não pode ser preenchida diretamente em input type="file"
        document.getElementById('image').value = '';
        // Exibir a miniatura da imagem
        const previewImage = document.getElementById('previewImage');
        if (newsItem.image) {
            previewImage.src = newsItem.image;
            previewImage.style.display = 'block';
        } else {
            previewImage.style.display = 'none';
        }
    }
}