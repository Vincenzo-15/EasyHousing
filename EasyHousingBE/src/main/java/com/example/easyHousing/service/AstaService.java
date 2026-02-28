package com.example.immobiliareClone.service;

import com.example.immobiliareClone.exception.exceptions.RecordNotFoundException;
import com.example.immobiliareClone.persistence.dao.AstaDao;
import com.example.immobiliareClone.persistence.model.Asta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AstaService {

    @Autowired
    private AstaDao astaDao;

    public AstaService(AstaDao astaDao) {
        this.astaDao = astaDao;
    }

    public List<Asta> getAllAste() {
        return astaDao.findAllAste();
    }

    public Asta getAstaById(Integer idAsta) throws RecordNotFoundException {
        Asta asta = astaDao.findByIdAsta(idAsta);
        if (asta == null) {
            throw new RecordNotFoundException("Asta con ID " + idAsta + " non trovata.", 404);
        }
        return asta;
    }

    public Asta getAstaByImmobile(Integer idImmobile) throws RecordNotFoundException {
        Asta asta = astaDao.findByIdImmobile(idImmobile);
        if (asta == null) {

            throw new RecordNotFoundException("Nessuna asta trovata per l'immobile con ID " + idImmobile, 404);
        }
        return asta;
    }

    public List<Asta> getAsteByAcquirente(String acquirente) {
        return astaDao.findByAcquirente(acquirente);
    }

    public List<Asta> getAsteByPrezzoOrig(Double prezzoOrig) {
        return astaDao.findByPrezzoOrig(prezzoOrig);
    }

    public void creaAsta(Asta asta) {
        astaDao.save(asta);
    }

    public void aggiornaAsta(Asta asta) throws RecordNotFoundException {
        if (astaDao.findByIdAsta(asta.getIdAsta()) == null) {
            throw new RecordNotFoundException("Impossibile aggiornare: Asta non trovata.", 404);
        }
        astaDao.update(asta);
    }

    public void eliminaAsta(Asta asta) throws RecordNotFoundException {
        if (astaDao.findByIdAsta(asta.getIdAsta()) == null) {
            throw new RecordNotFoundException("Impossibile eliminare: Asta non trovata.", 404);
        }
        astaDao.delete(asta);
    }
}