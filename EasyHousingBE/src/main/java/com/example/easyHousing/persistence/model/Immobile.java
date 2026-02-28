package com.example.immobiliareClone.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Immobile {

    private Integer idImmobile;
    private String nome;
    private String tipoImmobile;
    private Double prezzoOrig;
    private Double prezzoAttuale;
    private String descrizione;
    private Float metriQuadri;
    private String indirizzo;
    private String proprietario;
    private String tipoAnnuncio;

    private List<Recensione> recensioni;

}