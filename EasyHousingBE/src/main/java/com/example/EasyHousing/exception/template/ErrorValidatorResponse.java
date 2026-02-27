package com.example.immobiliareClone.exception.template;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ErrorValidatorResponse {

    private Date date = new Date();
    private int code;
    private String message;
    private List<String> details;

}
