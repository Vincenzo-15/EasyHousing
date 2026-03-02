package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Utente;
import com.example.easyHousing.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping
    public Utente login(@RequestBody Utente loginData) throws RecordNotFoundException {
        // loginData conterrà solo email e password inviati dal frontend
        Utente utenteTrovato = utenteService.getUtenteByEmail(loginData.getEmail());

        if (utenteTrovato != null && utenteTrovato.getPassword().equals(loginData.getPassword())) {
            return utenteTrovato; // Login successo: restituisci l'utente completo (senza password magari)
        } else {
            return null; // O lancia un'eccezione / restituisci 401 Unauthorized
        }
    }
}
