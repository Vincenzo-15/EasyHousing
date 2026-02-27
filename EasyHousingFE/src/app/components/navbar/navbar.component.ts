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
}
