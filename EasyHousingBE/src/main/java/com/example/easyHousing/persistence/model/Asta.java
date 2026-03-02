package com.example.easyHousing.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Asta {

    private Integer idAsta;
    private Integer idImmobile;        // id dell'immobile messo in asta
    private String acquirente;       // ultimo offerente
    private Double prezzoOrig;
    private Double prezzoAttuale;
    private Timestamp fine;               // timestamp di fine asta
}
