import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  async addProduct(userId: string, productData: { name: string; quantity: number; brand: string }) {
    const userRef = this.firestore.collection('users').doc(userId).collection('products');
    return await userRef.add(productData); // Adiciona o produto
  }

  getProducts(uid: string) {
    return this.firestore.collection(`users/${uid}/products`).snapshotChanges();
  }

  async deleteProduct(uid: string, productId: string) {
    await this.firestore.doc(`users/${uid}/products/${productId}`).delete();
  }

  async updateProduct(uid: string, productId: string, updatedProduct: { name: string; quantity: number; brand: string }) {
    await this.firestore.doc(`users/${uid}/products/${productId}`).update(updatedProduct);
  }

  async loginWithEmail({ email, password }: { email: string; password: string }) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async signup({ email, password }: { email: string; password: string }) {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  }

  async saveDetails(userId: string, details: any) {
    return await this.firestore.collection('users').doc(userId).set(details);
  }
}
