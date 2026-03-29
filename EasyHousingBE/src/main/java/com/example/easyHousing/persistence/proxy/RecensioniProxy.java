package com.example.easyHousing.persistence.proxy;

import com.example.easyHousing.persistence.dao.RecensioneDao;
import com.example.easyHousing.persistence.model.Recensione;

import java.util.ArrayList;

public class RecensioniProxy extends ArrayList<Recensione> {

    private final RecensioneDao recensioneDao;
    private final Integer idImmobile;
    private boolean isLoaded = false;

    public RecensioniProxy(RecensioneDao recensioneDao, Integer idImmobile) {
        this.recensioneDao = recensioneDao;
        this.idImmobile = idImmobile;
    }

    private void load() {
        if (!isLoaded) {
            // Lazy Loading: recupera le recensioni dal DB solo quando servono
            super.addAll(recensioneDao.findByIdImmobile(idImmobile));
            isLoaded = true;
        }
    }

    @Override
    public int size() {
        load();
        return super.size();
    }

    @Override
    public Recensione get(int index) {
        load();
        return super.get(index);
    }

    @Override
    public java.util.Iterator<Recensione> iterator() {
        load();
        return super.iterator();
    }

    @Override
    public Object[] toArray() {
        load();
        return super.toArray();
    }

    // ==============================================================
    // METODI AGGIUNTIVI PER GARANTIRE IL LAZY LOADING IN OGNI CASO
    // ==============================================================

    @Override
    public boolean isEmpty() {
        load();
        return super.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        load();
        return super.contains(o);
    }

    @Override
    public java.util.stream.Stream<Recensione> stream() {
        load();
        return super.stream();
    }
}
