package com.example.easyHousing.controller;

import com.example.easyHousing.persistence.model.Utente;
import com.example.easyHousing.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@CrossOrigin(origins = "http://localhost:4200")
public class RegisterController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody Utente utente) {
        try {
            if (utente.getRuolo() == null) {
                utente.setRuolo("ACQUIRENTE");
            }
            utenteService.creaUtente(utente);
            return ResponseEntity.ok().build(); // Restituisce 200 OK se va tutto bene

        } catch (IllegalArgumentException e) {
            // Se l'email esiste, restituisce 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"errore\": \"EMAIL_ESISTENTE\"}");
        }
    }
}
