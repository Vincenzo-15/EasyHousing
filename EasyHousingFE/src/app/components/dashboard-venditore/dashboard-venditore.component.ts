import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { AuthService } from '../../services/auth.service';
import { ImmagineService } from '../../services/immagine.service';

@Component({
  selector: 'app-dashboard-venditore',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-venditore.component.html',
  styleUrls: ['./dashboard-venditore.component.css']
})
export class DashboardVenditoreComponent implements OnInit {
  mieiImmobili: any[] = [];
  coverImages: { [id: number]: string } = {};

  editModeId: number | null = null;
  nuovoPrezzo: number = 0;

  constructor(
    private immobileService: ImmobileService,
    private authService: AuthService,
    private immagineService: ImmagineService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.email) {
      this.immobileService.getImmobiliByProprietario(user.email).subscribe({
        next: (data) => {
          this.mieiImmobili = data;
          this.mieiImmobili.forEach(imm => this.caricaCopertina(imm.idImmobile));
        },
        error: (err) => console.error("Errore caricamento immobili:", err)
      });
    }
  }

  caricaCopertina(idImmobile: number) {
    this.immagineService.getImmaginiByIdImmobile(idImmobile).subscribe({
      next: (immagini: any[]) => {
        if (immagini && immagini.length > 0) {
          this.coverImages[idImmobile] = immagini[0].immagine;
        }
      }
    });
  }

  elimina(id: number) {
    if (confirm("Sei sicuro di voler eliminare definitivamente questo annuncio?")) {
      this.immobileService.deleteImmobile(id).subscribe({
        next: () => {
          this.mieiImmobili = this.mieiImmobili.filter(i => i.idImmobile !== id);
        },
        error: (err) => alert("Errore durante l'eliminazione.")
      });
    }
  }

  attivaModifica(immobile: any) {
    this.editModeId = immobile.idImmobile;
    this.nuovoPrezzo = immobile.prezzoAttuale;
  }

  salvaPrezzo(immobile: any) {
    immobile.prezzoAttuale = this.nuovoPrezzo;

    this.immobileService.updateImmobile(immobile).subscribe({
      next: () => {
        this.editModeId = null;
        alert("Prezzo aggiornato con successo!");
      },
      error: (err) => {
        console.error("Errore aggiornamento:", err);
        alert("Errore durante l'aggiornamento del prezzo.");
      }
    });
  }

  annullaModifica() {
    this.editModeId = null;
  }

  // --- GESTIONE ERRORI IMMAGINI ---
  gestisciErroreImmagine(event: any) {
    event.target.src = 'https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile';
  }
}
