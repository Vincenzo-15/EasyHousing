import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtenteService } from '../../services/utente.service'; // <-- Importa il servizio
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


  constructor(
    public authService: AuthService,
    private utenteService: UtenteService, // <-- Iniettato qui
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utenteCorrente = this.authService.getUser();
    if (this.utenteCorrente) {
      this.utenteModificato = { ...this.utenteCorrente };
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
      this.utenteModificato = { ...this.utenteCorrente };
    }
  }

  // --- SALVATAGGIO REALE DEI DATI (NOME, COGNOME, EMAIL, TELEFONO) ---
  salvaModifica(campo: string) {
    if (!this.utenteCorrente) return;

    const utenteAggiornato = { ...this.utenteCorrente, ...this.utenteModificato } as Utente;

    this.utenteService.aggiornaUtente(utenteAggiornato).subscribe({
      next: () => {
        this.utenteCorrente = utenteAggiornato;

        // LA SOLUZIONE QUI: Aggiorniamo tramite l'AuthService
        this.authService.updateCurrentUser(utenteAggiornato);

        this.campoInModifica = null;
        alert(`Aggiornamento salvato con successo nel Database!`);
      },
      error: (err) => {
        console.error("Errore nell'aggiornamento:", err);
        alert("Si è verificato un errore durante il salvataggio.");
      }
    });
  }

  // --- SALVATAGGIO REALE DELLA NUOVA PASSWORD ---
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

    const utenteAggiornato = { ...this.utenteCorrente, password: this.nuovaPassword } as Utente;

    this.utenteService.aggiornaUtente(utenteAggiornato).subscribe({
      next: () => {
        this.utenteCorrente = utenteAggiornato;

        // LA SOLUZIONE QUI: Aggiorniamo tramite l'AuthService
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
    this.verificaInCorso = true; // Fa comparire la rotellina

    // Simuliamo un'attesa di rete di 1.5 secondi
    setTimeout(() => {
      this.verificaInCorso = false;
      this.emailVerificata = true; // Cambia il bottone in "Inviata"
      alert(`✅ Ti abbiamo appena inviato un link di verifica all'indirizzo:\n${this.utenteCorrente?.email}`);
    }, 1500);
  }
}
