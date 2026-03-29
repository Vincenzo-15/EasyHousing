package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Utente;
import com.example.easyHousing.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    @Autowired
    private UtenteService utenteService;

    // Modificato per restituire ResponseEntity: così possiamo inviare codici di errore (es. 401)
    @PostMapping
    public ResponseEntity<?> login(@RequestBody Utente loginData) {
        try {
            Utente utenteTrovato = utenteService.getUtenteByEmail(loginData.getEmail());

            // Se l'utente esiste e la password combacia
            if (utenteTrovato != null && utenteTrovato.getPassword().equals(loginData.getPassword())) {
                return ResponseEntity.ok(utenteTrovato);
            }
        } catch (RecordNotFoundException e) {
            // Se l'email non esiste
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali errate");
        }

        // Se la password è sbagliata
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali errate");
    }
}
