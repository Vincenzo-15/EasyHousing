package com.example.easyHousing.service;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.dao.UtenteDao;
import com.example.easyHousing.persistence.model.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtenteService {

    @Autowired
    private UtenteDao utenteDao;

    public UtenteService(UtenteDao utenteDao) {
        this.utenteDao = utenteDao;
    }

    public List<Utente> getAllUtenti() {
        return utenteDao.findAllUtenti();
    }

    public Utente getUtenteById(Integer idUtente) throws RecordNotFoundException {
        Utente utente = utenteDao.findByIdUtente(idUtente);
        if (utente == null) {
            throw new RecordNotFoundException("Utente con ID " + idUtente + " non trovato.", 404);
        }
        return utente;
    }

    public Utente getUtenteByEmail(String email) throws RecordNotFoundException {
        Utente utente = utenteDao.findByEmail(email);
        if (utente == null) {
            throw new RecordNotFoundException("Utente con email " + email + " non trovato.", 404);
        }
        return utente;
    }

    public List<Utente> getUtentiByRuolo(String ruolo) {
        return utenteDao.findByRuolo(ruolo);
    }

    public void creaUtente(Utente utente) {

        utenteDao.save(utente);
    }

    public void aggiornaUtente(Utente utente) throws RecordNotFoundException {
        if (utenteDao.findByIdUtente(utente.getIdUtente()) == null) {
            throw new RecordNotFoundException("Impossibile aggiornare: Utente non trovato.", 404);
        }
        utenteDao.update(utente);
    }

    public void eliminaUtente(Utente utente) throws RecordNotFoundException {
        if (utenteDao.findByIdUtente(utente.getIdUtente()) == null) {
            throw new RecordNotFoundException("Impossibile eliminare: Utente non trovato.", 404);
        }
        utenteDao.delete(utente);
    }
}