import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService
  ) {}

  ngOnInit(): void {
    this.caricaDettagli();
  }

  caricaDettagli() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // 1. Carica info immobile
      this.immobileService.getImmobileById(id).subscribe({
        next: (data: Immobile) => {
          this.immobile = data;
        },
        error: (err: any) => console.error('Errore immobile:', err)
      });

      // 2. Carica le immagini
      this.immagineService.getImmaginiByIdImmobile(id).subscribe({
        next: (imgs: Immagine[]) => { // Corretto tipo
          this.immagini = imgs;
          console.log("Immagini caricate:", this.immagini);
        },
        error: (err: any) => console.error('Errore immagini:', err) // Corretto tipo
      });
    }
  }
}

