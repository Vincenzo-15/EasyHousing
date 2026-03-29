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
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.preferitiService.caricaPreferitiUtenteCorrente();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login fallito', err);

        // --- NUOVA GESTIONE ERRORI ---
        if (err.status === 403) {
          // Se il server ci manda un 403 Forbidden, l'account è bannato!
          alert('⛔ ACCESSO NEGATO: Il tuo account è stato sospeso da un Amministratore per violazione delle regole.');
        } else {
          // Altrimenti ha solo sbagliato la password
          alert('Credenziali errate. Riprova.');
        }
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
