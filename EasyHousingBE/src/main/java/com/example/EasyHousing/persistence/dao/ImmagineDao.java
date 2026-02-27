package com.example.immobiliareClone.persistence.dao;

import com.example.immobiliareClone.persistence.model.Immagine;
import java.util.List;

public interface ImmagineDao {

    List<Immagine> findByIdImmobile(Integer idImmobile);

    void save(Immagine immagine);

    void delete(Immagine immagine);

}
