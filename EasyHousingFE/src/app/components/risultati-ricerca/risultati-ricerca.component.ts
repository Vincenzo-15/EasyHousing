import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { Immobile } from '../../models/immobile.model';
import { ImmagineService } from '../../services/immagine.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-risultati-ricerca',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './risultati-ricerca.component.html',
  styleUrls: ['./risultati-ricerca.component.css']
})
export class RisultatiRicercaComponent implements OnInit, AfterViewInit {
  immobiliTutti: Immobile[] = [];
  immobiliFiltrati: Immobile[] = [];
  coverImages: { [id: number]: string } = {};

  filtroKeyword: string = '';
  filtroTipo: string = 'Tutti';
  filtroPrezzo: number = 0;
  filtroContratto: string = 'TUTTI';

  private map: any;
  private markers: L.Marker[] = [];
  private mapInitialized = false;
  // CACHE: Memorizza le coordinate delle nuove città per non sovraccaricare l'API esterna
  private geocodeCache: { [indirizzo: string]: [number, number] } = {};

  private customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService
  ) {}

  ngOnInit(): void {
    this.immobileService.getAllImmobili().subscribe({
      next: (data) => {
        this.immobiliTutti = data;
        data.forEach(imm => this.caricaCopertina(imm.idImmobile));

        this.route.queryParams.subscribe(params => {
          this.filtroKeyword = params['keyword'] || '';
          this.filtroTipo = params['tipo'] || 'Tutti';
          this.filtroPrezzo = params['prezzo'] ? +params['prezzo'] : 0;
          this.filtroContratto = params['contratto'] || 'TUTTI';

          this.applicaFiltri();
        });
      },
      error: (err) => console.error("Errore nel caricamento immobili:", err)
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement && !this.mapInitialized) {
      this.map = L.map('map').setView([41.9028, 12.4964], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);

      this.mapInitialized = true;
      this.aggiornaMappaLeaflet();
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

  applicaFiltri() {
    this.immobiliFiltrati = this.immobiliTutti.filter(immobile => {
      const nomeSafe = immobile.nome ? immobile.nome.toLowerCase() : '';
      const indirizzoSafe = immobile.indirizzo ? immobile.indirizzo.toLowerCase() : '';
      const keywordSafe = this.filtroKeyword ? this.filtroKeyword.toLowerCase() : '';
      const tipoAnnuncioSafe = immobile.tipoAnnuncio ? immobile.tipoAnnuncio.toUpperCase() : '';

      const matchKeyword = !keywordSafe || nomeSafe.includes(keywordSafe) || indirizzoSafe.includes(keywordSafe);
      const matchTipo = this.filtroTipo === 'Tutti' || immobile.tipoImmobile === this.filtroTipo;
      const matchPrezzo = this.filtroPrezzo === 0 || immobile.prezzoAttuale <= this.filtroPrezzo;
      const matchContratto = this.filtroContratto === 'TUTTI' || tipoAnnuncioSafe === this.filtroContratto;

      return matchKeyword && matchTipo && matchPrezzo && matchContratto;
    });

    if (this.mapInitialized) {
      this.aggiornaMappaLeaflet();
    }
  }

  async aggiornaMappaLeaflet() {
    if (!this.mapInitialized || !this.map) return;

    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // 1. Dizionario veloce per gli immobili di base (per un caricamento istantaneo)
    const coordinateCitta: { [key: string]: [number, number] } = {
      'roma': [41.9028, 12.4964], 'milano': [45.4642, 9.1900], 'positano': [40.6281, 14.4850],
      'siena': [43.3188, 11.3308], 'torino': [45.0703, 7.6869], 'bologna': [44.4949, 11.3426],
      'firenze': [43.7696, 11.2558], 'padova': [45.4064, 11.8768], 'napoli': [40.8518, 14.2681],
      'verona': [45.4384, 10.9916], 'salerno': [40.6824, 14.7681], 'cortina': [46.5405, 12.1366]
    };

    let viewLat = 41.8719; // Centro Italia
    let viewLng = 12.5674;
    let zoomLevel = 5.5;

    // 2. CENTRATURA DINAMICA TRAMITE API
    // Se l'utente cerca una città non in lista (es. "Cosenza"), l'API trova le coordinate e ci vola sopra!
    if (this.filtroKeyword && this.filtroKeyword.trim() !== '') {
      const keywordLower = this.filtroKeyword.toLowerCase();
      let found = false;

      for (const citta in coordinateCitta) {
        if (keywordLower.includes(citta)) {
          viewLat = coordinateCitta[citta][0];
          viewLng = coordinateCitta[citta][1];
          zoomLevel = 12;
          found = true;
          break;
        }
      }

      // Se la parola cercata non è nel dizionario, usa l'API OpenStreetMap!
      if (!found) {
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.filtroKeyword)}`);
          const data = await resp.json();
          if (data && data.length > 0) {
            viewLat = parseFloat(data[0].lat);
            viewLng = parseFloat(data[0].lon);
            zoomLevel = 12;
          }
        } catch (e) { console.error("API Ricerca fallita"); }
      }
    }

    // 3. POSIZIONAMENTO MARKER DEGLI IMMOBILI CON API GEOCODING
    // Usiamo for...of invece di forEach perché stiamo usando 'await'
    for (const immobile of this.immobiliFiltrati) {
      let lat = 41.9028;
      let lng = 12.4964;
      let trovataInCache = false;

      const indirizzoLower = immobile.indirizzo.toLowerCase();

      // Controllo rapido nel dizionario locale
      for (const citta in coordinateCitta) {
        if (indirizzoLower.includes(citta)) {
          lat = coordinateCitta[citta][0] + (Math.random() - 0.5) * 0.015;
          lng = coordinateCitta[citta][1] + (Math.random() - 0.5) * 0.015;
          trovataInCache = true;
          break;
        }
      }

      // Se è un immobile nuovo in una città sconosciuta, CHIAMIAMO L'API ESTERNA!
      if (!trovataInCache) {
        if (this.geocodeCache[immobile.indirizzo]) {
          // Se l'abbiamo già cercata prima, usa la cache per essere velocissimi
          lat = this.geocodeCache[immobile.indirizzo][0];
          lng = this.geocodeCache[immobile.indirizzo][1];
        } else {
          // Altrimenti contatta OpenStreetMap per avere le coordinate esatte dell'indirizzo
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(immobile.indirizzo)}`);
            const data = await response.json();
            if (data && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lng = parseFloat(data[0].lon);
              this.geocodeCache[immobile.indirizzo] = [lat, lng]; // Salva nella cache
            }
          } catch (error) {
            console.error("Geocoding fallito per:", immobile.indirizzo);
          }
        }
      }

      const coverUrl = this.coverImages[immobile.idImmobile] || 'https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile';

      const popupContent = `
        <a href="/dettaglio/${immobile.idImmobile}" style="text-decoration: none; color: inherit; display: block; width: 220px;">
          <div class="card popup-card border-0 overflow-hidden h-100">
            <div class="position-relative">
              <img src="${coverUrl}"
                   onerror="this.src='https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile'"
                   class="card-img-top object-fit-cover popup-card-image"
                   style="height: 140px;"
                   alt="Immobile">
              <span class="badge bg-primary position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill shadow-sm text-uppercase" style="font-size: 0.7rem;">
                ${immobile.tipoAnnuncio}
              </span>
            </div>
            <div class="card-body p-3 d-flex flex-column">
              <h5 class="fw-bold text-dark mb-1">€ ${immobile.prezzoAttuale.toLocaleString('it-IT')}</h5>
              <h6 class="card-title fw-bold text-dark text-truncate mb-2" title="${immobile.nome}">${immobile.nome}</h6>
              <div class="d-flex gap-3 text-muted small mb-3">
                <span class="d-flex align-items-center"><i class="bi bi-arrows-fullscreen me-1"></i>${immobile.metriQuadri} m²</span>
                <span class="d-flex align-items-center"><i class="bi bi-house me-1"></i>${immobile.tipoImmobile}</span>
              </div>
              <p class="text-muted small text-truncate mt-auto mb-0"><i class="bi bi-geo-alt me-1"></i>${immobile.indirizzo}</p>
            </div>
          </div>
        </a>
      `;

      const marker = L.marker([lat, lng], { icon: this.customIcon }).addTo(this.map);
      marker.bindPopup(popupContent, { minWidth: 220 });
      this.markers.push(marker);
    }

    this.map.flyTo([viewLat, viewLng], zoomLevel, { animate: true, duration: 0.8 });
  }

  onFiltroCambiato() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.filtroKeyword,
        tipo: this.filtroTipo,
        prezzo: this.filtroPrezzo,
        contratto: this.filtroContratto
      },
      queryParamsHandling: 'merge'
    });
  }



  apriDettaglio(id: number) {
    this.router.navigate(['/dettaglio', id]);
  }
  // --- GESTIONE ERRORI IMMAGINI ---
  gestisciErroreImmagine(event: any) {
    event.target.src = 'https://placehold.co/800x500/f8f9fa/a3a3a3?text=Nessuna+Foto+Disponibile';
  }
}
