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

    @PostMapping
    public ResponseEntity<?> login(@RequestBody Utente loginData) {
        try {
            Utente utenteTrovato = utenteService.getUtenteByEmail(loginData.getEmail());

            if (utenteTrovato != null && utenteTrovato.getPassword().equals(loginData.getPassword())) {

                // --- NUOVO: CONTROLLO BAN ---
                if (utenteTrovato.getBannato() != null && utenteTrovato.getBannato()) {
                    // Se l'utente è bannato, blocchiamo l'accesso
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"errore\": \"ACCOUNT_BANNATO\"}");
                }

                return ResponseEntity.ok(utenteTrovato);
            }
        } catch (RecordNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"errore\": \"Credenziali errate\"}");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"errore\": \"Credenziali errate\"}");
    }
}
