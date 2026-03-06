import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { ImmagineService } from '../../services/immagine.service';
import { Immobile } from '../../models/immobile.model';
import { RouterModule, ActivatedRoute } from '@angular/router'; // <--- AGGIUNTO ActivatedRoute

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  immobiliTutti: Immobile[] = [];
  immobili: Immobile[] = [];
  coverImages: { [id: number]: string } = {};

  filtroKeyword: string = '';
  filtroTipo: string = 'Tutti';
  filtroPrezzo: number = 0;
  filtroContratto: string = 'VENDITA';

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private route: ActivatedRoute // <--- AGGIUNTO QUI
  ) {}

  ngOnInit(): void {
    this.caricaImmobili();

    // --- NUOVO CODICE PER FAR FUNZIONARE IL PULSANTE "ABOUT US" ---
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'about-section') {
        // Usiamo setTimeout per dare tempo alla pagina di caricare i dati (se veniamo da un'altra pagina)
        setTimeout(() => {
          const element = document.getElementById('about-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
    // --------------------------------------------------------------
  }

  caricaImmobili() {
    this.immobileService.getAllImmobili().subscribe({
      next: (data: Immobile[]) => {
        this.immobiliTutti = data;
        this.immobili = data;

        this.applicaFiltri();

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

  applicaFiltri() {
    this.immobili = this.immobiliTutti.filter(immobile => {

      const matchKeyword = !this.filtroKeyword ||
        immobile.nome.toLowerCase().includes(this.filtroKeyword.toLowerCase()) ||
        immobile.indirizzo.toLowerCase().includes(this.filtroKeyword.toLowerCase());

      const matchTipo = this.filtroTipo === 'Tutti' ||
        immobile.tipoImmobile === this.filtroTipo;

      const matchPrezzo = this.filtroPrezzo === 0 ||
        immobile.prezzoAttuale <= this.filtroPrezzo;

      const tipoAnnuncioSafe = immobile.tipoAnnuncio ? immobile.tipoAnnuncio.toUpperCase() : '';
      const matchContratto = this.filtroContratto === 'TUTTI' ||
        tipoAnnuncioSafe === this.filtroContratto;

      return matchKeyword && matchTipo && matchPrezzo && matchContratto;
    });
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scorriLista(direzione: 'sinistra' | 'destra') {
    const container = this.scrollContainer.nativeElement;
    const quantitaScroll = 344;

    if (direzione === 'sinistra') {
      container.scrollBy({ left: -quantitaScroll, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: quantitaScroll, behavior: 'smooth' });
    }
  }
}
