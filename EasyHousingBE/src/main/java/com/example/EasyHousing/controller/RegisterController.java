package com.example.immobiliareClone.controller;

import com.example.immobiliareClone.persistence.model.Utente;
import com.example.immobiliareClone.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@CrossOrigin(origins = "http://localhost:4200")
public class RegisterController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping
    public void register(@RequestBody Utente utente) {
        // Qui potresti settare il ruolo di default se non arriva dal frontend
        if (utente.getRuolo() == null) {
            utente.setRuolo("ACQUIRENTE");
        }
        utenteService.creaUtente(utente);
    }
}
