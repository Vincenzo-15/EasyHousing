import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ImmobileService } from '../../services/immobile.service';
import { AuthService } from '../../services/auth.service';
import { Immobile } from '../../models/immobile.model';
import { ImmagineService } from '../../services/immagine.service';

@Component({
  selector: 'app-inserisci-annuncio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserisci-annuncio.component.html',
  styleUrls: ['./inserisci-annuncio.component.css']
})
export class InserisciAnnuncioComponent {

  nuovoImmobile: Immobile = {
    idImmobile: 0,
    nome: '',
    descrizione: '',
    indirizzo: '',
    metriQuadri: 0,
    prezzoOrig: 0,
    prezzoAttuale: 0,
    tipoImmobile: 'Appartamento',
    tipoAnnuncio: 'VENDITA',
    proprietario: '',
    recensioni: []
  };

  filesSelezionati: File[] = [];

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.filesSelezionati.push(event.target.files[i]);
      }
    }
  }

  rimuoviFile(index: number) {
    this.filesSelezionati.splice(index, 1);
  }

  onSubmit() {
    const utenteCorrente = this.authService.getUser();

    // Controllo Login
    if (!utenteCorrente) {
      alert('Devi effettuare il login per pubblicare.');
      this.router.navigate(['/login']);
      return;
    }

    this.nuovoImmobile.proprietario = utenteCorrente.email;
    this.nuovoImmobile.prezzoAttuale = this.nuovoImmobile.prezzoOrig;

    console.log('1. Salvataggio Immobile...', utenteCorrente.email);

    this.immobileService.createImmobile(this.nuovoImmobile).subscribe({
      next: () => {
        this.recuperaIdEUploadFoto(utenteCorrente.email);
      },
      error: (err: any) => {
        console.error(err);
        alert('Errore salvataggio immobile');
      }
    });
  }

  recuperaIdEUploadFoto(proprietario: string) {
    this.immobileService.getAllImmobili().subscribe((immobili: Immobile[]) => {
      const mieiImmobili = immobili.filter(i => i.proprietario === proprietario);

      if (mieiImmobili.length > 0) {
        mieiImmobili.sort((a, b) => b.idImmobile - a.idImmobile);
        const nuovoId = mieiImmobili[0].idImmobile;

        console.log('2. ID Trovato:', nuovoId);
        this.uploadFiles(nuovoId);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  uploadFiles(idImmobile: number) {
    // Caso 1: Nessun file selezionato -> Vai subito alla home
    if (this.filesSelezionati.length === 0) {
      alert('Annuncio pubblicato (senza foto).');
      this.router.navigate(['/home']);
      return;
    }

    let tentativiCompletati = 0;
    let errori = 0;

    // Cicla su ogni file
    this.filesSelezionati.forEach(file => {
      this.immagineService.uploadImmagine(idImmobile, file).subscribe({
        next: () => {
          tentativiCompletati++;
          this.checkChiusuraPagina(tentativiCompletati, errori);
        },
        error: (err: any) => {
          console.error('Errore upload file:', file.name, err);
          tentativiCompletati++; // Contiamo comunque il tentativo come "fatto" (anche se fallito)
          errori++;
          this.checkChiusuraPagina(tentativiCompletati, errori);
        }
      });
    });
  }

  // Funzione di supporto per decidere quando chiudere
  checkChiusuraPagina(fatti: number, errori: number) {
    // Se abbiamo finito di processare tutti i file (con successo o errore)
    if (fatti === this.filesSelezionati.length) {
      if (errori === 0) {
        alert('Annuncio e Foto pubblicati con successo! 🚀');
      } else if (errori < this.filesSelezionati.length) {
        alert(`Annuncio pubblicato, ma ${errori} foto non sono state caricate. Controlla la console.`);
      } else {
        alert('Annuncio pubblicato, ma il caricamento delle foto è fallito. (File troppo grandi o server spento?)');
      }
      this.router.navigate(['/home']); // Ora reindirizza SEMPRE
    }
  }
}
