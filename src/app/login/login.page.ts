import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar Router
import { FirestoreService } from '../services/firestore.service'; // Altere para o caminho correto

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  @ViewChild('modal', { static: false }) modal: ElementRef | undefined;
  @ViewChild('actionModal', { static: false }) actionModal: ElementRef | undefined;
  @ViewChild('closeModal', { static: false }) closeModal: ElementRef | undefined;

  // Propriedades para o formulário de login
  email: string = '';
  password: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private renderer: Renderer2,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router, // Injetar Router
    private fireService: FirestoreService) {}



  ngOnInit() { }

  ngAfterViewInit() {
    // Obtendo todos os inputs com a classe "input"
    const inputs = document.querySelectorAll('.input');

    // Adicionando eventos de foco e blur usando Renderer2
    inputs.forEach(input => {
      this.renderer.listen(input, 'focus', this.focusFunc.bind(this));
      this.renderer.listen(input, 'blur', this.blurFunc.bind(this));
    });

    // Adicionando evento de clique ao botão do modal
    if (this.actionModal && this.modal) {
      this.renderer.listen(this.actionModal.nativeElement, 'click', () => {
        this.modal!.nativeElement.style.display = 'block';
      });
    }

    // Adicionando evento para fechar o modal
    if (this.closeModal && this.modal) {
      this.renderer.listen(this.closeModal.nativeElement, 'click', () => {
        this.modal!.nativeElement.style.display = 'none';
      });
    }

    // Fechar o modal ao clicar fora dele
    this.renderer.listen(window, 'click', (event: Event) => {
      if (event.target === this.modal?.nativeElement) {
        this.modal.nativeElement.style.display = 'none';
      }
    });
  }

  // Função para adicionar o estilo "focus" ao container pai do input
  focusFunc(event: FocusEvent) {
    const parent = (event.target as HTMLElement).closest('.input-div');
    if (parent) {
      parent.classList.add('focus');
    }
  }

  // Função para remover o estilo "focus" se o input estiver vazio
  blurFunc(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    const parent = input.closest('.input-div');
    if (parent && input.value === '') {
      parent.classList.remove('focus');
    }
  }

 // Função para login
 async login() {
  try {
    await this.fireService.loginWithEmail({ email: this.email, password: this.password });
    this.router.navigate(['/home']); // Redirecionar para a página Home após login
  } catch (error: any) {
    this.showToast('Erro ao fazer login: Credências erradas, tente novamente.');
  }
}

async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 5000,
  });
  toast.present();
}
}
