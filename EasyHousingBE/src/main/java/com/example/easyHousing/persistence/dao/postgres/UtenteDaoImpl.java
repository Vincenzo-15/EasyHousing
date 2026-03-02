package com.example.easyHousing.persistence.dao.postgres;

import com.example.easyHousing.persistence.DBConnection;
import com.example.easyHousing.persistence.dao.UtenteDao;
import com.example.easyHousing.persistence.model.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UtenteDaoImpl implements UtenteDao {

    @Autowired
    private DBConnection dbConnection;

    @Override
    public List<Utente> findAllUtenti() {
        List<Utente> utenti = new ArrayList<>();
        String query = "SELECT * FROM utente";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                utenti.add(mapResultSetToUtente(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return utenti;
    }

    @Override
    public Utente findByIdUtente(Integer idUtente) {
        // NOTA: Usiamo \"idUtente\" per forzare le maiuscole come nel tuo DB
        String query = "SELECT * FROM utente WHERE \"idUtente\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idUtente);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToUtente(resultSet);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Utente findByEmail(String email) {
        String query = "SELECT * FROM utente WHERE email = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToUtente(resultSet);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Utente> findByRuolo(String tipologia) {
        List<Utente> utenti = new ArrayList<>();
        String query = "SELECT * FROM utente WHERE ruolo = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, tipologia);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    utenti.add(mapResultSetToUtente(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return utenti;
    }

    @Override
    public void save(Utente utente) {
        // CORREZIONE: Rimossa "idUtente" dalla insert, assumendo sia Auto-Increment
        String query = "INSERT INTO utente (nome, cognome, email, telefono, ruolo, password) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            // Nota: idUtente rimosso, partiamo da index 1 con il nome
            statement.setString(1, utente.getNome());
            statement.setString(2, utente.getCognome());
            statement.setString(3, utente.getEmail());
            statement.setString(4, utente.getTelefono());
            statement.setString(5, utente.getRuolo());
            statement.setString(6, utente.getPassword());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void update(Utente utente) {
        String query = "UPDATE utente SET nome = ?, cognome = ?, email = ?, telefono = ?, ruolo = ?, password = ? WHERE \"idUtente\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, utente.getNome());
            statement.setString(2, utente.getCognome());
            statement.setString(3, utente.getEmail());
            statement.setString(4, utente.getTelefono());
            statement.setString(5, utente.getRuolo());
            statement.setString(6, utente.getPassword());
            statement.setInt(7, utente.getIdUtente());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Utente utente) {
        String query = "DELETE FROM utente WHERE \"idUtente\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, utente.getIdUtente());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Utente mapResultSetToUtente(ResultSet resultSet) throws SQLException {
        Utente utente = new Utente();
        // Nel result set usiamo il nome esatto della colonna
        utente.setIdUtente(resultSet.getInt("idUtente"));
        utente.setNome(resultSet.getString("nome"));
        utente.setCognome(resultSet.getString("cognome"));
        utente.setEmail(resultSet.getString("email"));
        utente.setTelefono(resultSet.getString("telefono"));
        utente.setRuolo(resultSet.getString("ruolo"));
        utente.setPassword(resultSet.getString("password"));
        return utente;
    }
}