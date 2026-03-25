import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtenteService } from '../../services/utente.service'; // Assicurati di aver creato questo service!
import { Utente } from '../../models/utente.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  utenti: Utente[] = [];

  constructor(
    private utenteService: UtenteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sicurezza: blocca chi non è admin
    if (!this.authService.isAdmin()) {
      alert('Accesso negato. Solo gli amministratori possono visualizzare questa pagina.');
      this.router.navigate(['/home']);
      return;
    }
    this.caricaUtenti();
  }

  caricaUtenti() {
    this.utenteService.getAllUtenti().subscribe({
      next: (data) => this.utenti = data,
      error: (err) => console.error('Errore nel recupero utenti', err)
    });
  }

  toggleBan(utente: Utente) {
    const id = utente.idUtente!;
    const azione = utente.bannato ? 'sbloccare' : 'bannare';

    if (confirm(`Sei sicuro di voler ${azione} l'utente ${utente.email}?`)) {
      this.utenteService.toggleBan(id).subscribe({
        next: () => {
          utente.bannato = !utente.bannato; // Inverte lo stato nella tabella HTML
          alert(`Utente ${utente.bannato ? 'bannato' : 'sbloccato'} con successo.`);
        },
        error: (err) => alert('Errore durante l\'operazione.')
      });
    }
  }

  promuovi(utente: Utente) {
    if (confirm(`Vuoi davvero promuovere ${utente.email} ad Amministratore?`)) {
      this.utenteService.promuoviAdmin(utente.idUtente!).subscribe({
        next: () => {
          utente.ruolo = 'ADMIN';
          alert('Utente promosso con successo.');
        },
        error: (err) => alert('Errore durante la promozione.')
      });
    }
  }

  eliminaUtente(id: number) {
    if (confirm('Attenzione! Eliminare un utente cancellerà permanentemente il suo account. Procedere?')) {
      this.utenteService.deleteUtente(id).subscribe({
        next: () => {
          // Rimuove l'utente dalla lista locale istantaneamente
          this.utenti = this.utenti.filter(u => u.idUtente !== id);
        },
        error: (err) => alert('Errore durante l\'eliminazione.')
      });
    }
  }
}
