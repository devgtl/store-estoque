import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore.service'; 
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';

  constructor(
    private fireService: FirestoreService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async registerUser() {
    if (this.password !== this.confirmPassword) {
      this.showToast('As senhas não coincidem');
      return;
    }

    try {
      const userCredential = await this.fireService.signup({
        email: this.email,
        password: this.password
      });

      const uid = userCredential.user?.uid; // Obtendo o UID do usuário registrado

      // Salvar os detalhes do usuário no Firestore
      await this.fireService.saveDetails(uid!, { 
        email: this.email,
        name: this.name,
        password: this.password,
      });

      this.showToast('Usuário registrado com sucesso');
      this.router.navigate(['/login']);
    }catch (error: any) {
      this.showToast('Erro ao registrar: Credenciais inválidas, por favor tente novamente.');
    }
    
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000
    });
    toast.present();
  }
}
