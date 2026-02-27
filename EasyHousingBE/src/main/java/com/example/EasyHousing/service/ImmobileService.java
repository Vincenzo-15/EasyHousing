package com.example.immobiliareClone.service;

import com.example.immobiliareClone.exception.exceptions.RecordNotFoundException;
import com.example.immobiliareClone.persistence.dao.ImmobileDao;
import com.example.immobiliareClone.persistence.model.Immobile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImmobileService {

    @Autowired
    private ImmobileDao immobileDao;

    public ImmobileService(ImmobileDao immobileDao) {
        this.immobileDao = immobileDao;
    }

    public List<Immobile> getAllImmobili() {
        return immobileDao.findAllImmobili();
    }

    public Immobile getImmobileById(Integer idImmobile) throws RecordNotFoundException {
        Immobile immobile = immobileDao.findByIdImmobile(idImmobile);
        if (immobile == null) {
            throw new RecordNotFoundException("Immobile con ID " + idImmobile + " non trovato.", 404);
        }
        return immobile;
    }

    public List<Immobile> getImmobiliByProprietario(String proprietario) {
        return immobileDao.findByProprietario(proprietario);
    }

    public List<Immobile> getImmobiliByTipoAnnuncio(String tipoAnnuncio) {
        return immobileDao.findByTipoAnnuncio(tipoAnnuncio);
    }

    public List<Immobile> getImmobiliOrderByPrezzoAsc() {
        return immobileDao.findAllOrderByPrezzoAsc();
    }

    public List<Immobile> getImmobiliOrderByPrezzoDesc() {
        return immobileDao.findAllOrderByPrezzoDesc();
    }

    public void creaImmobile(Immobile immobile) {
        immobileDao.save(immobile);
    }

    public void aggiornaImmobile(Immobile immobile) throws RecordNotFoundException {

        if (immobileDao.findByIdImmobile(immobile.getIdImmobile()) == null) {
            throw new RecordNotFoundException("Impossibile aggiornare: Immobile con ID " + immobile.getIdImmobile() + " non trovato.", 404);
        }
        immobileDao.update(immobile);
    }

    public void eliminaImmobile(Immobile immobile) throws RecordNotFoundException {

        if (immobileDao.findByIdImmobile(immobile.getIdImmobile()) == null) {
            throw new RecordNotFoundException("Impossibile eliminare: Immobile con ID " + immobile.getIdImmobile() + " non trovato.", 404);
        }
        immobileDao.delete(immobile);
    }
}