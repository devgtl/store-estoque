import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  itemName: string = '';
  itemQuantity: number | null = null;
  itemBrand: string = '';
  items: Array<{ id: string; name: string; quantity: number; brand: string }> = [];
  
  isEditMode: boolean = false; // Variável para alternar entre cadastro e atualização
  currentItemId: string | null = null; // ID do item atual para atualizar

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private router: Router,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Exibe uma mensagem toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  // Adiciona um item novo
  addItem() {
    if (this.itemName && this.itemQuantity !== null && this.itemBrand) {
      this.addProduct(); // Chama a função para adicionar o produto
      this.clearForm(); // Limpa o formulário após adicionar
    } else {
      this.showToast('Por favor, preencha todos os campos.');
    }
  }

  // Adiciona o produto ao Firestore
  async addProduct() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const productData = {
        name: this.itemName,
        quantity: this.itemQuantity ?? 0,
        brand: this.itemBrand,
      };
      console.log("Dados do produto:", productData); // Verifique o que está sendo enviado

  
      try {
        const docRef = await this.firestoreService.addProduct(user.uid, productData);
        this.showToast('Produto adicionado com sucesso!');
        this.items.push({ id: docRef.id, ...productData }); // Adiciona o produto à lista local
      } catch (error) {
        this.showToast('Erro ao adicionar o produto: ' + (error as any).message);
      }
    } else {
      this.showToast('Usuário não autenticado.');
    }
  }

  // Entra no modo de edição ao clicar em um item
  editProduct(product: { id: string; name: string; quantity: number; brand: string }) {
    this.itemName = product.name;
    this.itemQuantity = product.quantity;
    this.itemBrand = product.brand;
    this.currentItemId = product.id;
    this.isEditMode = true;
  }

  // Atualiza o produto no Firestore
  async updateProduct(productId: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const updatedProduct = {
        name: this.itemName,
        quantity: this.itemQuantity ?? 0,
        brand: this.itemBrand,
      };
      try {
        await this.firestoreService.updateProduct(user.uid, productId, updatedProduct);
        this.showToast('Produto atualizado com sucesso!');
        this.isEditMode = false; // Volta para o modo de cadastro
        this.clearForm();
        this.loadProducts();
      } catch (error) {
        this.showToast('Erro ao atualizar o produto: ' + (error as any).message);
      }
    }
  }

  // Remove um produto do Firestore
  async deleteProduct(productId: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        await this.firestoreService.deleteProduct(user.uid, productId);
        this.showToast('Produto excluído com sucesso!');
        this.loadProducts(); // Recarrega a lista de produtos
      } catch (error) {
        this.showToast('Erro ao excluir o produto: ' + (error as any).message);
      }
    }
  }

  // Limpa o formulário
  clearForm() {
    this.itemName = '';
    this.itemQuantity = null;
    this.itemBrand = '';
    this.currentItemId = null;
    this.isEditMode = false;
  }
  
  // Carrega os produtos do Firestore
  async loadProducts() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.firestoreService.getProducts(user.uid).subscribe((productsSnapshot: any) => {
        this.items = productsSnapshot.map((doc: any) => ({
          id: doc.payload.doc.id,
          ...doc.payload.doc.data(),
        }));
      });
    }
  }

  // Método para logout
  async logout() {
    await this.afAuth.signOut();
    this.showToast('Você saiu com sucesso');
    this.router.navigate(['/login']);
  }
}
