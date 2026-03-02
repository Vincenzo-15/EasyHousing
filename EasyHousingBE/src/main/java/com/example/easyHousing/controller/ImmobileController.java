package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Immobile;
import com.example.easyHousing.service.ImmobileService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/immobili")
@CrossOrigin(origins = "http://localhost:4200")
public class ImmobileController {

    @Autowired
    private ImmobileService immobileService;
    private final String uploadPath = "uploads/";

    @GetMapping("/findByAllImmobili")
    public List<Immobile> findAllImmobili() throws RecordNotFoundException {
        return immobileService.getAllImmobili();
    }

    @GetMapping("/findByIdImmobile/{idImmobile}")
    public Immobile findByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return immobileService.getImmobileById(idImmobile);
    }

    // Cambia questa riga nel Controller
    @GetMapping("/findByProprietario/{proprietario:.+}")
    public List<Immobile> findByProprietario(@PathVariable String proprietario) throws RecordNotFoundException {
        return immobileService.getImmobiliByProprietario(proprietario);
    }

    @GetMapping("/findByTipoAnnuncio/{tipoAnnuncio}")
    public List<Immobile> findByTipoAnnuncio(@PathVariable String tipoAnnuncio) throws RecordNotFoundException {
        return immobileService.getImmobiliByTipoAnnuncio(tipoAnnuncio);
    }

    @GetMapping("/findAllOrderByPrezzoAsc")
    public List<Immobile> findAllOrderByPrezzoAsc() throws RecordNotFoundException {
        return immobileService.getImmobiliOrderByPrezzoAsc();
    }

    @GetMapping("/findAllOrderByPrezzoDesc")
    public List<Immobile> findAllOrderByPrezzoDesc() throws RecordNotFoundException {
        return immobileService.getImmobiliOrderByPrezzoDesc();
    }

    // CORREZIONE: Rimosso {immobile} dall'URL
    @PostMapping("/save")
    public void save(@RequestBody Immobile immobile) throws RecordNotFoundException {
        immobileService.creaImmobile(immobile);
    }

    // CORREZIONE: Rimosso {immobile} dall'URL
    @PutMapping("/update")
    public void update(@RequestBody Immobile immobile) throws RecordNotFoundException {
        immobileService.aggiornaImmobile(immobile);
    }

    // CORREZIONE: Si passa l'ID, poi creiamo l'oggetto per il DAO
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException {
        Immobile immobile = new Immobile();
        immobile.setIdImmobile(id);
        immobileService.eliminaImmobile(immobile);
    }

}