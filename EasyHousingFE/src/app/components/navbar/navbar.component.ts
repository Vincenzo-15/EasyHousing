import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // FONDAMENTALE per usare *ngIf
import { RouterModule, Router } from '@angular/router'; // FONDAMENTALE per routerLink e navigazione
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Aggiungiamo CommonModule e RouterModule agli imports
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Iniettiamo AuthService come 'public' così l'HTML può leggerlo direttamente
  constructor(public authService: AuthService, private router: Router) {}

  doLogout() {
    this.authService.logout(); // Pulisce il localStorage
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
