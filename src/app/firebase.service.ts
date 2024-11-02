import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Método para adicionar um produto
  addProduct(userId: string, productData: any) {
    return this.firestore.collection(`users/${userId}/products`).add(productData);
  }

  // Método para obter produtos
  getProducts(userId: string) {
    return this.firestore.collection(`users/${userId}/products`).snapshotChanges();
  }

  // Método para excluir um produto
  deleteProduct(userId: string, productId: string) {
    return this.firestore.doc(`users/${userId}/products/${productId}`).delete();
  }

  // Método para atualizar um produto
  updateProduct(userId: string, productId: string, updatedProduct: any) {
    return this.firestore.doc(`users/${userId}/products/${productId}`).update(updatedProduct);
  }
}
