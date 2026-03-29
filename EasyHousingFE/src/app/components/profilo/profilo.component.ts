import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtenteService } from '../../services/utente.service';
import { Utente } from '../../models/utente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {

  utenteCorrente: Utente | null = null;
  utenteModificato: Partial<Utente> = {};

  sezioneAttiva: string = 'contatto';
  campoInModifica: string | null = null;

  vecchiaPassword = '';
  nuovaPassword = '';

  verificaInCorso = false;
  emailVerificata = false;

  // --- ESPRESSIONI REGOLARI PER LA VALIDAZIONE ---
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,-_]).{8,}$/;

  constructor(
    public authService: AuthService,
    private utenteService: UtenteService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.utenteCorrente = this.authService.getUser();
    if (this.utenteCorrente) {
      this.utenteModificato = {...this.utenteCorrente};
    }
  }

  cambiaSezione(sezione: string) {
    this.sezioneAttiva = sezione;
    this.annullaModifica();
  }

  iniziaModifica(campo: string) {
    this.campoInModifica = campo;
  }

  annullaModifica() {
    this.campoInModifica = null;
    this.vecchiaPassword = '';
    this.nuovaPassword = '';
    if (this.utenteCorrente) {
      this.utenteModificato = {...this.utenteCorrente};
    }
  }

  // --- SALVATAGGIO DATI (CON VALIDAZIONE EMAIL) ---
  salvaModifica(campo: string) {
    if (!this.utenteCorrente) return;

    // Se stiamo modificando l'email, facciamo il controllo di sicurezza
    if (campo === 'email' && this.utenteModificato.email) {
      if (!this.emailRegex.test(this.utenteModificato.email)) {
        alert("⛔ Formato Email non valido. Inserisci un indirizzo corretto.");
        return; // Blocca l'esecuzione
      }
    }

    const utenteAggiornato = {...this.utenteCorrente, ...this.utenteModificato} as Utente;

    this.utenteService.aggiornaUtente(utenteAggiornato).subscribe({
      next: () => {
        this.utenteCorrente = utenteAggiornato;
        this.authService.updateCurrentUser(utenteAggiornato);
        this.campoInModifica = null;
        alert(`Aggiornamento salvato con successo nel Database!`);
      },
      error: (err) => {
        console.error("Errore nell'aggiornamento:", err);

        // --- GESTIONE ERRORE EMAIL DUPLICATA ---
        if (err.status === 409 || err.status === 500) {
          alert("⛔ Impossibile aggiornare: Questa email è già utilizzata da un altro utente sul sito.");
        } else {
          alert("Si è verificato un errore di rete durante il salvataggio.");
        }
      }
    });
  }

  // --- SALVATAGGIO PASSWORD (CON VALIDAZIONE REGEX) ---
  salvaPassword() {
    if (!this.utenteCorrente) return;

    if (this.vecchiaPassword === '' || this.nuovaPassword === '') {
      alert("Compila entrambi i campi per cambiare la password.");
      return;
    }

    if (this.vecchiaPassword !== this.utenteCorrente.password) {
      alert("La vecchia password è errata!");
      return;
    }

    // Validazione nuova password
    if (!this.passwordRegex.test(this.nuovaPassword)) {
      alert("⛔ La nuova Password è troppo debole!\nDeve contenere:\n- Almeno 8 caratteri\n- Almeno 1 numero\n- Almeno 1 carattere speciale (!@#$%^&*.,-_)");
      return; // Blocca l'esecuzione
    }

    const utenteAggiornato = {...this.utenteCorrente, password: this.nuovaPassword} as Utente;

    this.utenteService.aggiornaUtente(utenteAggiornato).subscribe({
      next: () => {
        this.utenteCorrente = utenteAggiornato;
        this.authService.updateCurrentUser(utenteAggiornato);
        this.annullaModifica();
        alert("Password cambiata con successo nel Database!");
      },
      error: (err) => {
        console.error("Errore aggiornamento password:", err);
        alert("Errore durante il cambio password.");
      }
    });
  }

  mostraAvvisoMockup(event: Event) {
    event.preventDefault();
    alert("Questa sezione è un mockup dimostrativo per l'esame.");
  }

  doLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  inviaEmailVerifica() {
    this.verificaInCorso = true;
    setTimeout(() => {
      this.verificaInCorso = false;
      this.emailVerificata = true;
      alert(`✅ Ti abbiamo appena inviato un link di verifica all'indirizzo:\n${this.utenteCorrente?.email}`);
    }, 1500);
  }
}
