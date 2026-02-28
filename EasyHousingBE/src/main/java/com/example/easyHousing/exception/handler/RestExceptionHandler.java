package com.example.immobiliareClone.exception.handler;

import com.example.immobiliareClone.exception.exceptions.PostgresException;
import com.example.immobiliareClone.exception.exceptions.RecordNotFoundException;
import com.example.immobiliareClone.exception.template.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URISyntaxException;

@ControllerAdvice
@RestController
@Slf4j
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    private ObjectMapper mapper;

    @PostConstruct
    private void init() {
        log.debug("Metodo privato chiamato: init");
        try {
            this.mapper = new ObjectMapper();
            mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @ExceptionHandler(PostgresException.class)
    public ResponseEntity<ErrorResponse> exceptionPostgresHandler(PostgresException ex, WebRequest request){
        ErrorResponse error = new ErrorResponse();
        error.setCode(ex.getCode());
        error.setDetails(ex.getResult().getOutDescription());
        return new ResponseEntity<ErrorResponse>(error, new HttpHeaders(), HttpStatus.PRECONDITION_FAILED);
    }

    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<ErrorResponse> exceptionRecordNotFoundHandler(RecordNotFoundException ex, WebRequest request){
        ErrorResponse error = new ErrorResponse();
        error.setCode(ex.getCode());
        if(ex.getMessage() != null){
            error.setMessage(error.getCode() + ex.getMessage());
        } else {
            error.setMessage(String.valueOf(error.getCode()));
        }
        return new ResponseEntity<ErrorResponse>(error, new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> genericExceptionHandler(Exception ex, WebRequest request){
        ex.printStackTrace();
        ErrorResponse error = new ErrorResponse();
        error.setCode(2);
        error.setMessage(String.valueOf(error.getCode()));
        error.setDetails(ex.getMessage());
        return new ResponseEntity<ErrorResponse>(error, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
