package com.example.easyHousing.persistence.dao;

import com.example.easyHousing.persistence.model.Recensione;

import java.util.List;

public interface RecensioneDao {

    List<Recensione> findAllRecensioni();

    Recensione findByIdRecensione(Integer idRecensione);

    List<Recensione> findByIdImmobile(Integer idImmobile);

    List<Recensione> findByIdUtente(Integer idUtente);

    List<Recensione> findTopReviewsByIdImmobile(Integer idImmobile);

    List<Recensione> findLowestReviewsByIdImmobile(Integer idImmobile);

    void save(Recensione recensione);

    void update(Recensione recensione);

    void delete(Recensione recensione);

}
