package com.example.immobiliareClone.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Immagine {

    private Integer idImmagine;
    private Integer idImmobile;
    private String immagine;

}


