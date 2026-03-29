import {Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  immobiliTutti: Immobile[] = [];
  immobili: Immobile[] = [];
  ultimiInseriti: Immobile[] = [];
  ultimeRicerche: any[] = [];
  coverImages: { [id: number]: string } = {};

  filtroKeyword: string = '';
  filtroTipo: string = 'Tutti';
  filtroPrezzo: number = 0;
  filtroContratto: string = 'VENDITA';

  // Dati Città in evidenza
  cittaEvidenza = [
    { nome: 'Milano', img: 'assets/images/milano.jpeg' },
    { nome: 'Roma', img: 'assets/images/roma.jpeg' },
    { nome: 'Firenze', img: 'assets/images/firenze.jpeg' },
    { nome: 'Napoli', img: 'assets/images/napoli.jpeg' }
  ];

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private route: ActivatedRoute,
    private router: Router,
    public preferitiService: PreferitiService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.caricaImmobili();
    if (this.authService.isLoggedIn()) {
      this.caricaUltimeRicerche();
    }
  }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-reveal');
          }
        });
      }, { threshold: 0.10 });

      setTimeout(() => {
        document.querySelectorAll('.reveal-element').forEach((el) => {
          observer.observe(el);
        });
      }, 300);
    }
  }

  scroll(direzione: 'sinistra' | 'destra') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = 400; // Pixel di spostamento per ogni clic

    if (direzione === 'sinistra') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  caricaImmobili() {
    this.immobileService.getAllImmobili().subscribe({
      next: (data: Immobile[]) => {
        this.immobiliTutti = data;
        this.immobili = data;
        this.ultimiInseriti = [...data].sort((a, b) => b.idImmobile - a.idImmobile).slice(0, 6);
        this.applicaFiltri();
        this.immobiliTutti.forEach(immobile => this.caricaCopertina(immobile.idImmobile));
      }
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

  impostaFiltroContratto(tipo: string) {
    this.filtroContratto = tipo;
    this.applicaFiltri();
  }

  applicaFiltri() {
    this.immobili = this.immobiliTutti.filter(immobile => {
      const matchKeyword = !this.filtroKeyword || immobile.nome.toLowerCase().includes(this.filtroKeyword.toLowerCase()) || immobile.indirizzo.toLowerCase().includes(this.filtroKeyword.toLowerCase());
      const matchTipo = this.filtroTipo === 'Tutti' || immobile.tipoImmobile === this.filtroTipo;
      const matchPrezzo = this.filtroPrezzo === 0 || immobile.prezzoAttuale <= this.filtroPrezzo;
      const tipoAnnuncioSafe = immobile.tipoAnnuncio ? immobile.tipoAnnuncio.toUpperCase() : '';
      const matchContratto = this.filtroContratto === 'TUTTI' || tipoAnnuncioSafe === this.filtroContratto;
      return matchKeyword && matchTipo && matchPrezzo && matchContratto;
    });
  }

  eseguiRicerca() {
    if (this.authService.isLoggedIn()) this.salvaRicerca();
    this.router.navigate(['/risultati-ricerca'], { queryParams: { keyword: this.filtroKeyword, tipo: this.filtroTipo, prezzo: this.filtroPrezzo, contratto: this.filtroContratto } });
  }

  eseguiRicercaCitta(citta: string) {
    this.router.navigate(['/risultati-ricerca'], { queryParams: { keyword: citta, contratto: 'TUTTI' } });
  }

  togglePreferito(event: Event, immobile: Immobile) {
    event.stopPropagation();
    event.preventDefault();
    this.preferitiService.togglePreferito(immobile);
  }

  isPreferito(idImmobile: number): boolean { return this.preferitiService.isPreferito(idImmobile); }
  gestisciErroreImmagine(event: any) { event.target.src = 'https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile'; }

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
    if (!this.filtroKeyword && this.filtroTipo === 'Tutti' && this.filtroPrezzo === 0 && this.filtroContratto === 'TUTTI') return;
    const key = this.getStorageKey();
    if (!key) return;

    const keywordSafe = this.filtroKeyword ? this.filtroKeyword.trim() : '';
    const keywordLabel = keywordSafe ? keywordSafe.charAt(0).toUpperCase() + keywordSafe.slice(1).toLowerCase() : '';
    const contrattoLabel = this.filtroContratto === 'TUTTI' ? 'vendita e affitto' : this.filtroContratto.toLowerCase();

    let titoloStr = `Case in ${contrattoLabel}`;
    if (keywordLabel) titoloStr += ` a ${keywordLabel}`;

    const tags: string[] = [];
    if (keywordLabel) tags.push(keywordLabel);
    if (this.filtroTipo !== 'Tutti') tags.push(this.filtroTipo);
    else tags.push('Residenziale');

    if (this.filtroPrezzo > 0) tags.push(`Max ${this.filtroPrezzo.toLocaleString('it-IT')}€`);

    const nuovaRicerca = { keyword: keywordSafe, tipo: this.filtroTipo, prezzo: this.filtroPrezzo, contratto: this.filtroContratto, titolo: titoloStr, tags: tags };

    const indiceDuplicato = this.ultimeRicerche.findIndex(r => (r.keyword || '').toLowerCase() === keywordSafe.toLowerCase() && r.tipo === nuovaRicerca.tipo && r.prezzo === nuovaRicerca.prezzo && r.contratto === nuovaRicerca.contratto);
    if (indiceDuplicato !== -1) this.ultimeRicerche.splice(indiceDuplicato, 1);

    this.ultimeRicerche.unshift(nuovaRicerca);
    if (this.ultimeRicerche.length > 4) this.ultimeRicerche.pop();
    localStorage.setItem(key, JSON.stringify(this.ultimeRicerche));
  }

  cancellaCronologiaRicerche() {
    if (confirm('Sei sicuro di voler cancellare la cronologia delle tue ricerche?')) {
      this.ultimeRicerche = [];
      const key = this.getStorageKey();
      if (key) localStorage.removeItem(key);
    }
  }

  apriRicercaSalvata(ricerca: any) {
    this.router.navigate(['/risultati-ricerca'], { queryParams: { contratto: ricerca.contratto, keyword: ricerca.keyword, tipo: ricerca.tipo, prezzo: ricerca.prezzo } });
  }
}
