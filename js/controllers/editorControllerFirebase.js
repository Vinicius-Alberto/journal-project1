import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class EditorControllerFirebase {
  constructor() {
    this.collectionRef = collection(db, 'news');
  }

  async saveNews(news) {
    await addDoc(this.collectionRef, {
      title: news.title,
      content: news.content,
      date: new Date().toISOString(),
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
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Notícia não encontrada');
    }
  }

  async updateNews(id, updatedFields) {
    await updateDoc(doc(db, 'news', id), updatedFields);
  }
}