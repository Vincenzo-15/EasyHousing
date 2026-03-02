package com.example.easyHousing.persistence;

import org.springframework.stereotype.Component;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class DBConnection {

    private static final String URL = "jdbc:postgresql://localhost:5432/immobiliare_db";
    private static final String USER = "postgres";
    private static final String PASSWORD = "1234";

    public Connection getConnection() {
        try {
            // Restituisce SEMPRE una NUOVA connessione per ogni richiesta
            // Sarà il DAO a doverla chiudere nel blocco try-with-resources
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            throw new RuntimeException("Errore connessione DB", e);
        }
    }
}