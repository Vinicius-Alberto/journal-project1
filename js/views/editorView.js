export default class EditorView {
  populateForm(newsItem) {
    document.getElementById('title').value = newsItem.title;
    document.getElementById('content').value = newsItem.content;

    // Não podemos preencher input type="file", então limpamos
    document.getElementById('image').value = '';

    // Exibir miniatura da imagem, se houver
    const previewImage = document.getElementById('previewImage');
    if (newsItem.image) {
      previewImage.src = newsItem.image;
      previewImage.style.display = 'block';
    } else {
      previewImage.style.display = 'none';
    }
  }

  fillEditModal(newsItem) {
    document.getElementById('editTitle').value = newsItem.title;
    document.getElementById('editContent').value = newsItem.content;

    const currentImage = document.getElementById('currentEditImage');
    if (newsItem.image) {
      currentImage.src = newsItem.image;
      currentImage.style.display = 'block';
    } else {
      currentImage.style.display = 'none';
    }
  }
}
