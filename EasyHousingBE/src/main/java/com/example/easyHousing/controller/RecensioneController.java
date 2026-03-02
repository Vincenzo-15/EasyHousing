package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Recensione;
import com.example.easyHousing.service.RecensioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recensioni")
@CrossOrigin(origins = "http://localhost:4200")
public class RecensioneController {

    @Autowired
    private RecensioneService recensioneService;

    @GetMapping("/findAllRecensioni")
    public List<Recensione> findAllRecensioni() throws RecordNotFoundException {
        return recensioneService.getAllRecensioni();
    }

    @GetMapping("/findByIdRecensione/{idRecensione}")
    public Recensione findByIdRecensione(@PathVariable Integer idRecensione) throws RecordNotFoundException {
        return recensioneService.getRecensioneById(idRecensione);
    }

    @GetMapping("/findByIdImmobile/{idImmobile}")
    public List<Recensione> findByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return recensioneService.getRecensioniByIdImmobile(idImmobile);
    }

    @GetMapping("/findByIdUtente/{idUtente}")
    public List<Recensione> findByIdUtente(@PathVariable Integer idUtente) throws RecordNotFoundException {
        return recensioneService.getRecensioniByIdUtente(idUtente);
    }

    @GetMapping("/findTopRecensioniByIdImmobile/{idImmobile}")
    public List<Recensione> findTopRecensioniByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return recensioneService.getTopRecensioniByImmobile(idImmobile);
    }

    @GetMapping("/findLowestRecensioniByIdImmobile/{idImmobile}")
    public List<Recensione> findLowestRecensioniByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return recensioneService.getLowestRecensioniByImmobile(idImmobile);
    }

    // CORREZIONE POST
    @PostMapping("/save")
    public void save(@RequestBody Recensione recensione) throws RecordNotFoundException {
        recensioneService.creaRecensione(recensione);
    }

    // CORREZIONE PUT
    @PutMapping("/update")
    public void update(@RequestBody Recensione recensione) throws RecordNotFoundException {
        recensioneService.aggiornaRecensione(recensione);
    }

    // CORREZIONE DELETE per ID
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException {
        Recensione recensione = new Recensione();
        recensione.setIdRecensione(id);
        recensioneService.eliminaRecensione(recensione);
    }
}