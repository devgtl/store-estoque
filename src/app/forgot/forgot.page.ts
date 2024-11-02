import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  email: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
  ) {}

  ngOnInit() {}

  async resetPassword() {
    if (!this.email) {
      this.showToast('Por favor, insira seu email.');
      return;
    }

    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      this.showToast('Link de redefinição de senha enviado para o seu email.');
    } catch (error) {
      this.showToast('Erro ao enviar o link de redefinição de senha. Verifique o email e tente novamente.');
      console.error(error); // Para fins de depuração
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}

