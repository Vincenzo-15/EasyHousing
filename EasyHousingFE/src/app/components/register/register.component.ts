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

  // Oggetto vuoto pronto per essere riempito dal form
  nuovoUtente: Utente = {
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    ruolo: 'ACQUIRENTE' // Valore di default
  } as Utente;

  constructor(private authService: AuthService, private router: Router) {}

  // --- ECCO LA FUNZIONE MANCANTE CHE RISOLVE L'ERRORE ---
  setRuolo(ruoloSelezionato: string) {
    this.nuovoUtente.ruolo = ruoloSelezionato;
  }
  // ------------------------------------------------------

  onRegister() {
    console.log('Registrazione in corso...', this.nuovoUtente);

    this.authService.register(this.nuovoUtente).subscribe({
      next: (resp) => {
        console.log('Utente creato:', resp);
        alert('Registrazione avvenuta con successo! Ora puoi accedere.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore registrazione', err);
        alert('Errore durante la registrazione. Riprova.');
      }
    });
  }
}
