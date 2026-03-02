package com.example.easyHousing.exception.template;

import lombok.Data;

import java.util.Date;

@Data
public class ErrorResponse {

    private Date date = new Date();
    private int code;
    private String message;
    private String details;

}
