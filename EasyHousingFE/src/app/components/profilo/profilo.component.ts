import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Utente } from '../../models/utente.model';
import { Router } from '@angular/router'; // <--- IMPORTANTE: Aggiungi il Router

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {

  utenteCorrente: Utente | null = null;

  constructor(
    public authService: AuthService,
    private router: Router // <--- INIETTATO QUI
  ) {}

  ngOnInit(): void {
    this.utenteCorrente = this.authService.getUser();
  }

  // NUOVO METODO PER IL LOGOUT DAL PROFILO
  doLogout() {
    this.authService.logout(); // 1. Cancella i dati
    this.router.navigate(['/login']); // 2. Ti teletrasporta al login!
  }
}
