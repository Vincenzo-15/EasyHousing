package com.example.immobiliareClone.persistence.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Utente {

    private Integer idUtente;
    private String nome;
    private String cognome;
    private String email;
    private String telefono;
    private String ruolo;
    private String password;
    private Boolean bannato;

}
