package com.example.easyHousing.persistence.dao;

import com.example.easyHousing.persistence.model.Immagine;
import java.util.List;

public interface ImmagineDao {

    List<Immagine> findByIdImmobile(Integer idImmobile);

    void save(Immagine immagine);

    void delete(Immagine immagine);

}
