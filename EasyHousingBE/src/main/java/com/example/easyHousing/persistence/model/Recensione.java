package com.example.easyHousing.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Recensione {

    private Integer idRecensione;
    private String titolo;
    private Integer valutazione;
    private Integer idUtente;
    private Integer idImmobile;

}

