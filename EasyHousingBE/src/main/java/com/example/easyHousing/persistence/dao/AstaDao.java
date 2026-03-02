package com.example.easyHousing.persistence.dao;

import com.example.easyHousing.persistence.model.Asta;

import java.util.List;

public interface AstaDao {

    List<Asta> findAllAste();

    Asta findByIdAsta(Integer idAsta);

    Asta findByIdImmobile(Integer idImmobile);

    List<Asta> findByAcquirente(String acquirente);

    List<Asta> findByPrezzoOrig(Double prezzoOrig);

    void save(Asta asta);

    void update(Asta asta);

    void delete(Asta asta);
}
