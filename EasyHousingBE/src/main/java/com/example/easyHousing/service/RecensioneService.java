package com.example.easyHousing.service;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.dao.RecensioneDao;
import com.example.easyHousing.persistence.model.Recensione;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecensioneService {

    @Autowired
    private RecensioneDao recensioneDao;

    public RecensioneService(RecensioneDao recensioneDao) {
        this.recensioneDao = recensioneDao;
    }

    public List<Recensione> getAllRecensioni() {
        return recensioneDao.findAllRecensioni();
    }

    public Recensione getRecensioneById(Integer idRecensione) throws RecordNotFoundException {
        Recensione recensione = recensioneDao.findByIdRecensione(idRecensione);
        if (recensione == null) {
            throw new RecordNotFoundException("Recensione con ID " + idRecensione + " non trovata.", 404);
        }
        return recensione;
    }

    public List<Recensione> getRecensioniByIdImmobile(Integer idImmobile) {
        return recensioneDao.findByIdImmobile(idImmobile);
    }

    public List<Recensione> getRecensioniByIdUtente(Integer idUtente) {
        return recensioneDao.findByIdUtente(idUtente);
    }

    public List<Recensione> getTopRecensioniByImmobile(Integer idImmobile) {
        return recensioneDao.findTopReviewsByIdImmobile(idImmobile);
    }

    public List<Recensione> getLowestRecensioniByImmobile(Integer idImmobile) {
        return recensioneDao.findLowestReviewsByIdImmobile(idImmobile);
    }

    public void creaRecensione(Recensione recensione) {
        recensioneDao.save(recensione);
    }

    public void aggiornaRecensione(Recensione recensione) throws RecordNotFoundException {
        if (recensioneDao.findByIdRecensione(recensione.getIdRecensione()) == null) {
            throw new RecordNotFoundException("Impossibile aggiornare: Recensione non trovata.", 404);
        }
        recensioneDao.update(recensione);
    }

    public void eliminaRecensione(Recensione recensione) throws RecordNotFoundException {
        if (recensioneDao.findByIdRecensione(recensione.getIdRecensione()) == null) {
            throw new RecordNotFoundException("Impossibile eliminare: Recensione non trovata.", 404);
        }
        recensioneDao.delete(recensione);
    }
}