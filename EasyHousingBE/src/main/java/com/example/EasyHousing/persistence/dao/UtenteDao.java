package com.example.immobiliareClone.persistence.dao;

import com.example.immobiliareClone.persistence.model.Utente;

import java.util.List;

public interface UtenteDao {

    List<Utente> findAllUtenti();

    Utente findByIdUtente(Integer idUtente);

    Utente findByEmail(String email);

    List<Utente> findByRuolo(String ruolo);

    void save(Utente utente);

    void update(Utente utente);

    void delete(Utente utente);
}
