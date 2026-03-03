import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { ImmobileService } from '../../services/immobile.service';
import { Immobile } from '../../models/immobile.model';
import { Immagine, ImmagineService } from '../../services/immagine.service';

@Component({
  selector: 'app-immobile-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './immobile-detail.component.html',
  styleUrls: ['./immobile-detail.component.css']
})
export class ImmobileDetailComponent implements OnInit {

  immobile: Immobile | undefined;
  immagini: Immagine[] = [];

  mappaUrlSicuro: SafeResourceUrl | undefined;

  constructor(
    private route: ActivatedRoute,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.caricaDettagli();
  }

  caricaDettagli() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // Carica info immobile
      this.immobileService.getImmobileById(id).subscribe({
        next: (data: Immobile) => {
          this.immobile = data;

          // 4. GENERAZIONE URL GOOGLE MAPS
          // Trasforma l'indirizzo in un formato URL valido (es. "Roma Via Roma 1" -> "Roma%20Via%20Roma%201")
          const indirizzoCodificato = encodeURIComponent(this.immobile.indirizzo);

          // Crea l'URL di embed gratuito di Google Maps
          const urlGoogleMaps = `https://maps.google.com/maps?q=${indirizzoCodificato}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

          // Diciamo ad Angular che l'URL è sicuro per essere usato in un iframe
          this.mappaUrlSicuro = this.sanitizer.bypassSecurityTrustResourceUrl(urlGoogleMaps);
        },
        error: (err: any) => console.error('Errore immobile:', err)
      });

      // Carica le immagini
      this.immagineService.getImmaginiByIdImmobile(id).subscribe({
        next: (imgs: Immagine[]) => {
          this.immagini = imgs;
        },
        error: (err: any) => console.error('Errore immagini:', err)
      });
    }
  }
}

