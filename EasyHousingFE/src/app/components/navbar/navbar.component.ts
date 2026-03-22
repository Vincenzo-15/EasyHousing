import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; // FONDAMENTALE per usare *ngIf
import { RouterModule, Router } from '@angular/router'; // FONDAMENTALE per routerLink e navigazione
import { AuthService } from '../../services/auth.service';
import {PreferitiService} from "../../services/preferiti.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Aggiungiamo CommonModule e RouterModule agli imports
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  numeroPreferiti: number = 0; // Per tenere traccia del numero di preferiti

  // Iniettiamo AuthService come 'public' così l'HTML può leggerlo direttamente
  constructor(public authService: AuthService, private router: Router, public preferitiService: PreferitiService) {}

  ngOnInit() {
    // Ci "iscriviamo" al service: ogni volta che aggiungi un preferito, questo numero si aggiorna da solo!
    this.preferitiService.preferiti$.subscribe(preferiti => {
      this.numeroPreferiti = preferiti.length;
    });
  }

  doLogout() {
    this.authService.logout(); // Pulisce il localStorage
    //this.preferitiService.caricaPreferitiUtenteCorrente();
    this.router.navigate(['/login']); // Riporta l'utente al login
  }

  goToAbout() {
    // 1. Naviga forzatamente verso la Home
    this.router.navigate(['/home']).then(() => {
      // 2. Aspetta 200 millisecondi per dare il tempo all'HTML di caricarsi
      setTimeout(() => {
        // 3. Cerca la sezione e scorre verso il basso in modo fluido
        const element = document.getElementById('about-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    });
  }
}
