package com.example.easyHousing.service;

import com.example.easyHousing.persistence.dao.ImmagineDao;
import com.example.easyHousing.persistence.model.Immagine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImmagineService {

    @Autowired
    private ImmagineDao immagineDao;

    public ImmagineService(ImmagineDao immagineDao) {
        this.immagineDao = immagineDao;
    }

    public List<Immagine> getImmaginiByIdImmobili(Integer idImmobile) {
        return immagineDao.findByIdImmobile(idImmobile);
    }

    public void creaImmagine(Immagine immagine) {
        immagineDao.save(immagine);
    }

    public void eliminaImmagine(Immagine immagine) {
        immagineDao.delete(immagine);
    }
}