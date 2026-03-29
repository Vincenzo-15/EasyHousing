import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtenteService } from '../../services/utente.service';
import { ImmobileService } from '../../services/immobile.service';
import { Utente } from '../../models/utente.model';
import { Immobile } from '../../models/immobile.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  utenti: Utente[] = [];
  immobili: Immobile[] = [];

  // Rimosso 'recensioni', ora sono gestite in-context negli annunci
  tabAttivo: 'utenti' | 'immobili' = 'utenti';

  constructor(
    private utenteService: UtenteService,
    private immobileService: ImmobileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      alert('Accesso negato. Solo gli amministratori possono visualizzare questa pagina.');
      this.router.navigate(['/home']);
      return;
    }
    this.caricaUtenti();
  }

  cambiaTab(tab: 'utenti' | 'immobili') {
    this.tabAttivo = tab;
    if (tab === 'utenti' && this.utenti.length === 0) this.caricaUtenti();
    if (tab === 'immobili' && this.immobili.length === 0) this.caricaImmobili();
  }

  // ==========================================
  // GESTIONE UTENTI
  // ==========================================
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
          utente.bannato = !utente.bannato;
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
    if (confirm('Attenzione! Eliminare un utente cancellerà permanentemente il suo account e i suoi dati associati. Procedere?')) {
      this.utenteService.deleteUtente(id).subscribe({
        next: () => {
          this.utenti = this.utenti.filter(u => u.idUtente !== id);
        },
        error: (err) => alert('Errore durante l\'eliminazione.')
      });
    }
  }

  // ==========================================
  // GESTIONE IMMOBILI
  // ==========================================
  caricaImmobili() {
    this.immobileService.getAllImmobili().subscribe({
      next: (data) => this.immobili = data,
      error: (err) => console.error('Errore nel recupero immobili', err)
    });
  }

  eliminaImmobile(id: number) {
    if (confirm('Sei sicuro di voler eliminare definitivamente questo annuncio dal database? L\'operazione è irreversibile.')) {
      this.immobileService.deleteImmobile(id).subscribe({
        next: () => {
          this.immobili = this.immobili.filter(i => i.idImmobile !== id);
          alert('Annuncio eliminato con successo.');
        },
        error: (err) => alert('Errore durante l\'eliminazione dell\'annuncio.')
      });
    }
  }
}
