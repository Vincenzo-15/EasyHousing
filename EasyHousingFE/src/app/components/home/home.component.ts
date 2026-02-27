import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE per ngModel
import { ImmobileService } from '../../services/immobile.service';
import { ImmagineService } from '../../services/immagine.service';
import { Immobile } from '../../models/immobile.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <--- Aggiungi FormsModule qui
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  immobiliTutti: Immobile[] = []; // Copia di backup completa
  immobili: Immobile[] = [];      // Lista filtrata mostrata
  coverImages: { [id: number]: string } = {};

  // Variabili per i filtri
  filtroKeyword: string = '';
  filtroTipo: string = 'Tutti';
  filtroPrezzo: number = 0; // 0 significa "Qualsiasi"
  filtroContratto: string = 'VENDITA';

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService
  ) {}

  ngOnInit(): void {
    this.caricaImmobili();
  }

  caricaImmobili() {
    this.immobileService.getAllImmobili().subscribe({
      next: (data: Immobile[]) => {
        this.immobiliTutti = data;
        this.immobili = data; // All'inizio mostriamo tutto

        this.applicaFiltri(); // Applica i filtri iniziali (se ci sono)

        // Carica le copertine
        this.immobili.forEach(immobile => {
          this.caricaCopertina(immobile.idImmobile);
        });
      },
      error: (err: any) => console.error('Errore caricamento', err)
    });
  }

  impostaFiltroContratto(tipo: string) {
    this.filtroContratto = tipo;
    this.applicaFiltri();
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

  // === LOGICA DI FILTRO ===
  applicaFiltri() {
    this.immobili = this.immobiliTutti.filter(immobile => {

      const matchKeyword = !this.filtroKeyword ||
        immobile.nome.toLowerCase().includes(this.filtroKeyword.toLowerCase()) ||
        immobile.indirizzo.toLowerCase().includes(this.filtroKeyword.toLowerCase());

      const matchTipo = this.filtroTipo === 'Tutti' ||
        immobile.tipoImmobile === this.filtroTipo;

      const matchPrezzo = this.filtroPrezzo === 0 ||
        immobile.prezzoAttuale <= this.filtroPrezzo;

      // NUOVO CONTROLLO SUL CONTRATTO (VENDITA/AFFITTO)
      const tipoAnnuncioSafe = immobile.tipoAnnuncio ? immobile.tipoAnnuncio.toUpperCase() : '';
      const matchContratto = this.filtroContratto === 'TUTTI' ||
        tipoAnnuncioSafe === this.filtroContratto;

      return matchKeyword && matchTipo && matchPrezzo && matchContratto;
    });
  }
}
