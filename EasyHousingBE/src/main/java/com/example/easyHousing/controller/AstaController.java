package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Asta;
import com.example.easyHousing.service.AstaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asta")
@CrossOrigin(origins = "http://localhost:4200")
public class AstaController {

    @Autowired
    private AstaService astaService;

    @GetMapping("/findByAllAste")
    public List<Asta> findAllAste() throws RecordNotFoundException {
        return astaService.getAllAste();
    }

    @GetMapping("/findByIdImmobile/{idImmobile}")
    public Asta findByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return astaService.getAstaByImmobile(idImmobile);
    }

    // CORREZIONE: Aggiunto lo slash iniziale "/" che mancava
    @GetMapping("/findByIdAsta/{idAsta}")
    public Asta findByIdAsta(@PathVariable Integer idAsta) throws RecordNotFoundException {
        return astaService.getAstaById(idAsta);
    }

    // CORREZIONE: Rimosso la doppia 'a' in 'acquirente'
    @GetMapping("/findByAcquirente/{acquirente}")
    public List<Asta> findByAcquirente(@PathVariable String acquirente) throws RecordNotFoundException {
        return astaService.getAsteByAcquirente(acquirente);
    }

    @GetMapping("/findByPrezzoOrig/{prezzoOrig}")
    public List<Asta> findByPrezzoOrig(@PathVariable Double prezzoOrig) throws RecordNotFoundException {
        return astaService.getAsteByPrezzoOrig(prezzoOrig);
    }

    // CORREZIONE POST
    @PostMapping("/save")
    public void save(@RequestBody Asta asta) throws RecordNotFoundException {
        astaService.creaAsta(asta);
    }

    // CORREZIONE PUT
    @PutMapping("/update")
    public void update(@RequestBody Asta asta) throws RecordNotFoundException {
        astaService.aggiornaAsta(asta);
    }

    // CORREZIONE DELETE per ID
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException {
        Asta asta = new Asta();
        asta.setIdAsta(id);
        astaService.eliminaAsta(asta);
    }
}