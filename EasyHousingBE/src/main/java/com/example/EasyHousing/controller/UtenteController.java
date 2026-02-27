package com.example.immobiliareClone.controller;

import com.example.immobiliareClone.exception.exceptions.RecordNotFoundException;
import com.example.immobiliareClone.persistence.model.Utente;
import com.example.immobiliareClone.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // CORREZIONE: URL pulito, dati nel Body
    @PostMapping("/save")
    public void save(@RequestBody Utente utente) throws RecordNotFoundException {
        utenteService.creaUtente(utente);
    }

    @PutMapping("/update")
    public void update(@RequestBody Utente utente) throws RecordNotFoundException {
        utenteService.aggiornaUtente(utente);
    }

    // CORREZIONE: Cancellazione per ID
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException {
        Utente utente = new Utente();
        utente.setIdUtente(id);
        utenteService.eliminaUtente(utente);
    }
}