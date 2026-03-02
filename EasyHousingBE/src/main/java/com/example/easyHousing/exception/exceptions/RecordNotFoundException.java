package com.example.easyHousing.exception.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecordNotFoundException extends Exception {

    private static final long serialVersionUID = 1L;
    private String message;
    private int code;

    public RecordNotFoundException(int code){
        this.code = code;
    }

}
