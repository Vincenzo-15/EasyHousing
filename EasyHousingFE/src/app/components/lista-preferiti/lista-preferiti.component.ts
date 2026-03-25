import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreferitiService } from '../../services/preferiti.service';
import { ImmagineService } from '../../services/immagine.service';
import { Immobile } from '../../models/immobile.model';

@Component({
  selector: 'app-lista-preferiti',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-preferiti.component.html',
  styleUrls: ['./lista-preferiti.component.css']
})
export class ListaPreferitiComponent implements OnInit {

  preferiti: Immobile[] = [];
  coverImages: { [id: number]: string } = {};

  constructor(
    public preferitiService: PreferitiService,
    private immagineService: ImmagineService
  ) {}

  ngOnInit(): void {
    this.preferitiService.preferiti$.subscribe(dati => {
      this.preferiti = dati;
      this.preferiti.forEach(imm => this.caricaCopertina(imm.idImmobile));
    });
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

  rimuoviDalCuore(event: Event, immobile: Immobile) {
    event.stopPropagation();
    event.preventDefault();
    this.preferitiService.togglePreferito(immobile);
  }

  // --- GESTIONE ERRORI IMMAGINI ---
  gestisciErroreImmagine(event: any) {
    event.target.src = 'https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile';
  }
}
