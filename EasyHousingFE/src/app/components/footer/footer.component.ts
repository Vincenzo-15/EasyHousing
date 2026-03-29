import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  annoCorrente = new Date().getFullYear();

  constructor(public authService: AuthService) {}

  mostraAvviso(event: Event) {
    event.preventDefault(); // Blocca lo scatto della pagina verso l'alto
    alert('Questa pagina è un Mockup grafico (solo a scopo dimostrativo per l\'esame) e non è implementata nel backend.');
  }
}


