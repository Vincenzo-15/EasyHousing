package com.example.immobiliareClone.dto.out.data;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonSerialize
public class ResultDataOUT implements Serializable {

    private static final long serialVersionUID = 1;

    private String outReturn;

    private String outMessageType;

    private String outDescription;

}
