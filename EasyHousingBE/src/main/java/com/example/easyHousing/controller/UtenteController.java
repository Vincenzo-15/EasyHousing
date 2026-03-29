package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Utente;
import com.example.easyHousing.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200")
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    @GetMapping("/findByAllUtenti")
    public List<Utente> findAllUtenti() throws RecordNotFoundException {
        return utenteService.getAllUtenti();
    }

    @GetMapping("/findByIdUtente/{idUtente}")
    public Utente findByIdUtente(@PathVariable Integer idUtente) throws RecordNotFoundException {
        return utenteService.getUtenteById(idUtente);
    }

    @GetMapping("/findByEmail/{email}")
    public Utente findByEmail(@PathVariable String email) throws RecordNotFoundException {
        return utenteService.getUtenteByEmail(email);
    }

    @GetMapping("/findByRuolo/{ruolo}")
    public List<Utente> findByRuolo(@PathVariable String ruolo) throws RecordNotFoundException {
        return utenteService.getUtentiByRuolo(ruolo);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Utente utente) throws RecordNotFoundException {
        try {
            utenteService.creaUtente(utente);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"errore\": \"EMAIL_ESISTENTE\"}");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Utente utente) throws RecordNotFoundException {
        try {
            utenteService.aggiornaUtente(utente);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"errore\": \"EMAIL_ESISTENTE\"}");
        }
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException {
        Utente utente = new Utente();
        utente.setIdUtente(id);
        utenteService.eliminaUtente(utente);
    }

    @PutMapping("/ban/{id}")
    public void toggleBanUtente(@PathVariable Integer id) throws RecordNotFoundException {
        utenteService.toggleBan(id);
    }

    @PutMapping("/promuovi/{id}")
    public void promuoviAdmin(@PathVariable Integer id) throws RecordNotFoundException {
        utenteService.promuoviAdAdmin(id);
    }
}