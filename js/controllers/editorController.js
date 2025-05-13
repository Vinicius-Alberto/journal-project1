
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {getFirestore,collection,addDoc,getDocs,deleteDoc,doc,updateDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class EditorController {
  constructor() {
    this.collectionRef = collection(db, 'news');
  }

  async saveNews(news) {
    const base64Length = news.image ? news.image.length * 0.75 : 0;
    if (base64Length > 1024 * 1024) {
      throw new Error("Imagem muito grande. O tamanho máximo permitido é 1MB.");
    }

    await addDoc(this.collectionRef, {
      title: news.title,
      content: news.content,
      date: news.date || new Date().toISOString(),
      image: news.image || ''
    });
  }

  async loadNews() {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteNews(id) {
    await deleteDoc(doc(db, 'news', id));
  }

  async getNewsById(id) {
    const docSnap = await getDoc(doc(db, 'news', id));
    if (!docSnap.exists()) throw new Error('Notícia não encontrada');
    return { id: docSnap.id, ...docSnap.data() };
  }

  async updateNews(id, updatedFields) {
    const base64Length = updatedFields.image ? updatedFields.image.length * 0.75 : 0;
    if (base64Length > 1024 * 1024) {
      throw new Error("Imagem muito grande. O tamanho máximo permitido é 1MB.");
    }
    await updateDoc(doc(db, 'news', id), updatedFields);
  }
}
