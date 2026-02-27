package com.example.immobiliareClone.persistence.dao;

import com.example.immobiliareClone.persistence.model.Immobile;
import com.example.immobiliareClone.persistence.model.Utente;
import java.util.List;

public interface ImmobileDao {

    List<Immobile> findAllImmobili();

    Immobile findByIdImmobile(Integer idImmobile);

    List<Immobile> findAllOrderByPrezzoAsc();

    List<Immobile> findAllOrderByPrezzoDesc();

    List<Immobile> findByProprietario(String proprietario);

    List<Immobile> findByTipoAnnuncio(String tipoAnnuncio);

    void save(Immobile immobile);

    void update(Immobile immobile);

    void delete(Immobile immobile);
}
