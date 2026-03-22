import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { ImmagineService } from '../../services/immagine.service';
import { Immobile } from '../../models/immobile.model';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PreferitiService } from '../../services/preferiti.service';
import { AuthService } from '../../services/auth.service';

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

  ultimiInseriti: Immobile[] = []; //per gli utenti non loggati
  ultimeRicerche: any[] = [];   //Per gli utenti loggati

  coverImages: { [id: number]: string } = {};

  filtroKeyword: string = '';
  filtroTipo: string = 'Tutti';
  filtroPrezzo: number = 0;
  filtroContratto: string = 'VENDITA';

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private route: ActivatedRoute,
    private router: Router,
    public preferitiService: PreferitiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.caricaImmobili();

    //Se è loggato, carica le ultime ricerche, altrimenti carica gli ultimi immobili
    if (this.authService.isLoggedIn()) {
      this.caricaUltimeRicerche();
    }

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

        //Estrapoliamo gli ultimi 6 annunci inseriti (ordianti per ID decrescente)
        this.ultimiInseriti = [...data]
          .sort((a, b) => b.idImmobile - a.idImmobile)
          .slice(0, 6);

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

  // Aggiunge/Rimuove dai preferiti
  togglePreferito(event: Event, immobile: Immobile) {
    event.stopPropagation(); // Evita di aprire la pagina di dettaglio quando clicchi il cuore
    event.preventDefault();
    this.preferitiService.togglePreferito(immobile);
  }

  // Controlla se è tra i preferiti per colorare il cuore
  isPreferito(idImmobile: number): boolean {
    return this.preferitiService.isPreferito(idImmobile);
  }

  private getStorageKey(): string | null {
    const utente = this.authService.getUser();
    return utente ? `ricerche_${utente.email}` : null;
  }

  caricaUltimeRicerche() {
    const key = this.getStorageKey();
    if (key) {
      const salvate = localStorage.getItem(key);
      this.ultimeRicerche = salvate ? JSON.parse(salvate) : [];
    }
  }

  salvaRicerca() {
    // Evitiamo di salvare una ricerca completamente vuota
    if (!this.filtroKeyword && this.filtroTipo === 'Tutti' && this.filtroPrezzo === 0 && this.filtroContratto === 'TUTTI') {
      return;
    }

    const key = this.getStorageKey();
    if (!key) return;

    // Puliamo la keyword da eventuali spazi vuoti iniziali/finali
    const keywordSafe = this.filtroKeyword ? this.filtroKeyword.trim() : '';

    // 1. Formattiamo le parole chiave per i testi
    const keywordLabel = keywordSafe ? keywordSafe.charAt(0).toUpperCase() + keywordSafe.slice(1).toLowerCase() : '';
    const contrattoLabel = this.filtroContratto === 'TUTTI' ? 'vendita e affitto' : this.filtroContratto.toLowerCase();

    // 2. Creiamo il Titolo (Es: "Case in vendita a Milano")
    let titoloStr = `Case in ${contrattoLabel}`;
    if (keywordLabel) {
      titoloStr += ` a ${keywordLabel}`;
    }

    // 3. Creiamo l'array dei "Tags" da mostrare nei bottoncini grigi
    const tags: string[] = [];
    if (keywordLabel) tags.push(keywordLabel);

    if (this.filtroTipo !== 'Tutti') {
      tags.push(this.filtroTipo);
    } else {
      tags.push('Residenziale'); // Di default, come su Immobiliare.it
    }

    if (this.filtroPrezzo > 0) {
      tags.push(`Max ${this.filtroPrezzo.toLocaleString('it-IT')}€`);
    }

    const nuovaRicerca = {
      keyword: keywordSafe,
      tipo: this.filtroTipo,
      prezzo: this.filtroPrezzo,
      contratto: this.filtroContratto,
      titolo: titoloStr,
      tags: tags
    };

    // --- NUOVA LOGICA ANTI-DUPLICATI INFALLIBILE ---
    // Cerchiamo nell'array se esiste già una ricerca con gli stessi esatti parametri
    const indiceDuplicato = this.ultimeRicerche.findIndex(r =>
      (r.keyword || '').toLowerCase() === keywordSafe.toLowerCase() &&
      r.tipo === nuovaRicerca.tipo &&
      r.prezzo === nuovaRicerca.prezzo &&
      r.contratto === nuovaRicerca.contratto
    );

    // Se troviamo un duplicato, lo eliminiamo dalla vecchia posizione
    if (indiceDuplicato !== -1) {
      this.ultimeRicerche.splice(indiceDuplicato, 1);
    }

    // Inseriamo la nuova ricerca in cima alla lista (Posizione 1)
    this.ultimeRicerche.unshift(nuovaRicerca);

    // Manteniamo un massimo di 4 card per non intasare la Home
    if (this.ultimeRicerche.length > 4) {
      this.ultimeRicerche.pop();
    }

    // Salviamo nel localStorage
    localStorage.setItem(key, JSON.stringify(this.ultimeRicerche));
  }

  // Cancella l'intera cronologia delle ricerche per l'utente loggato
  cancellaCronologiaRicerche() {
    if (confirm('Sei sicuro di voler cancellare la cronologia delle tue ricerche?')) {
      this.ultimeRicerche = []; // Svuota la lista a video
      const key = this.getStorageKey();
      if (key) {
        localStorage.removeItem(key); // Elimina i dati dal cassetto del browser
      }
    }
  }

  eseguiRicerca() {
    // Salva la ricerca nella cronologia se loggato
    if (this.authService.isLoggedIn()) {
      this.salvaRicerca();
    }

    // Invece di filtrare qui, NAVIGA verso la nuova pagina!
    this.router.navigate(['/risultati-ricerca'], {
      queryParams: {
        keyword: this.filtroKeyword,
        tipo: this.filtroTipo,
        prezzo: this.filtroPrezzo,
        contratto: this.filtroContratto
      }
    });
  }

  // Metodo sicuro per aprire la ricerca salvata
  apriRicercaSalvata(ricerca: any) {
    this.router.navigate(['/risultati-ricerca'], {
      queryParams: {
        contratto: ricerca.contratto,
        keyword: ricerca.keyword,
        tipo: ricerca.tipo,
        prezzo: ricerca.prezzo
      }
    });
  }
}
