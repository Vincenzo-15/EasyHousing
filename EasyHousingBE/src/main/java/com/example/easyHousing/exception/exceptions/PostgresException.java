package com.example.easyHousing.exception.exceptions;

import com.example.easyHousing.dto.out.data.ResultDataOUT;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostgresException extends Exception {

    private static final long serialVersionUID = 1L;
    private ResultDataOUT result;
    private final int code = 3;

    public PostgresException(ResultDataOUT result){
        super();
        this.result = result;
    }

}
