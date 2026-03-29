import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Serve per [(ngModel)]
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PreferitiService } from '../../services/preferiti.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private preferitiService: PreferitiService) {}

  onLogin() {
    // Qui chiamiamo il servizio
    // NOTA: Se il backend non è pronto, possiamo simulare il login qui per testare la grafica
    console.log('Tentativo login:', this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Login riuscito!', user);
        this.preferitiService.caricaPreferitiUtenteCorrente();
        this.router.navigate(['/home']); // Vai alla home dopo il login
      },
      error: (err) => {
        console.error('Login fallito', err);
        alert('Credenziali errate (o backend non collegato)');
      }
    });
  }

  recuperaPassword() {
    // Chiediamo all'utente di inserire l'email
    const emailInserita = window.prompt("Inserisci l'indirizzo email associato al tuo account per recuperare la password:");

    // Se l'utente ha inserito qualcosa e ha premuto OK
    if (emailInserita && emailInserita.trim() !== '') {
      // Fingiamo un caricamento e poi diamo il messaggio di successo
      alert(`✅ Ottimo! Abbiamo inviato un link di recupero all'indirizzo:\n${emailInserita}`);
    }
  }
}
