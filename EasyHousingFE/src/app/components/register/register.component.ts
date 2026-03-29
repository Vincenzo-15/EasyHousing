import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Utente } from '../../models/utente.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nuovoUtente: Utente = {
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    ruolo: 'ACQUIRENTE'
  } as Utente;

  // --- ESPRESSIONI REGOLARI PER LA VALIDAZIONE ---
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,-_]).{8,}$/;

  constructor(private authService: AuthService, private router: Router) {}

  setRuolo(ruoloSelezionato: string) {
    this.nuovoUtente.ruolo = ruoloSelezionato;
  }

  onRegister() {
    // 1. Validazione Email
    if (!this.emailRegex.test(this.nuovoUtente.email)) {
      alert("⛔ Formato Email non valido. Inserisci un indirizzo corretto (es. mario.rossi@email.com).");
      return; // Blocca l'esecuzione
    }

    // 2. Validazione Password
    if (!this.passwordRegex.test(<string>this.nuovoUtente.password)) {
      alert("⛔ La Password è troppo debole!\nDeve contenere:\n- Almeno 8 caratteri\n- Almeno 1 numero\n- Almeno 1 carattere speciale (!@#$%^&*.,-_)");
      return; // Blocca l'esecuzione
    }

    console.log('Registrazione in corso...', this.nuovoUtente);

    this.authService.register(this.nuovoUtente).subscribe({
      next: (resp) => {
        console.log('Utente creato:', resp);
        alert('Registrazione avvenuta con successo! Ora puoi accedere.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore registrazione', err);

        // --- GESTIONE ERRORE EMAIL DUPLICATA ---
        if (err.status === 409) {
          alert('⛔ Attenzione: Questa email è già associata a un account esistente. Prova ad accedere o usa un indirizzo diverso.');
        } else {
          alert('Errore durante la registrazione. Riprova.');
        }
      }
    });
  }
}
