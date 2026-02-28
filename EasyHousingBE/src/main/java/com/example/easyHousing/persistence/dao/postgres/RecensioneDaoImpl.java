package com.example.immobiliareClone.persistence.dao.postgres;

import com.example.immobiliareClone.persistence.DBConnection;
import com.example.immobiliareClone.persistence.dao.RecensioneDao;
import com.example.immobiliareClone.persistence.model.Recensione;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RecensioneDaoImpl implements RecensioneDao {

    @Autowired
    private DBConnection dbConnection;

    @Override
    public List<Recensione> findByIdImmobile(Integer idImmobile) {
        List<Recensione> recensioni = new ArrayList<>();
        String query = "SELECT * FROM recensione WHERE \"idImmobile\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idImmobile);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    recensioni.add(mapResultSetToRecensione(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recensioni;
    }

    @Override
    public List<Recensione> findByIdUtente(Integer idUtente) {
        List<Recensione> recensioni = new ArrayList<>();
        String query = "SELECT * FROM recensione WHERE \"idUtente\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idUtente);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    recensioni.add(mapResultSetToRecensione(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recensioni;
    }

    @Override
    public List<Recensione> findAllRecensioni() {
        List<Recensione> recensioni = new ArrayList<>();
        String query = "SELECT * FROM recensione";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                recensioni.add(mapResultSetToRecensione(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recensioni;
    }

    @Override
    public List<Recensione> findTopReviewsByIdImmobile(Integer idImmobile) {
        List<Recensione> recensioni = new ArrayList<>();
        String query = "SELECT * FROM recensione WHERE \"idImmobile\" = ? ORDER BY valutazione DESC";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idImmobile);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    recensioni.add(mapResultSetToRecensione(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recensioni;
    }

    @Override
    public List<Recensione> findLowestReviewsByIdImmobile(Integer idImmobile) {
        List<Recensione> recensioni = new ArrayList<>();
        String query = "SELECT * FROM recensione WHERE \"idImmobile\" = ? ORDER BY valutazione ASC";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idImmobile);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    recensioni.add(mapResultSetToRecensione(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recensioni;
    }

    @Override
    public Recensione findByIdRecensione(Integer idRecensione) {
        String query = "SELECT * FROM recensione WHERE \"idRecensione\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idRecensione);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToRecensione(resultSet);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void save(Recensione recensione) {
        // CORREZIONE: Rimossa "idRecensione" dalla query.
        // Essendo auto-increment, Postgres lo calcolerà da solo.
        String query = "INSERT INTO recensione (titolo, valutazione, \"idUtente\", \"idImmobile\") VALUES (?, ?, ?, ?)";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            // Ricalcoliamo gli indici dei parametri (ora sono solo 4)
            statement.setString(1, recensione.getTitolo());
            statement.setInt(2, recensione.getValutazione());
            statement.setInt(3, recensione.getIdUtente());
            statement.setInt(4, recensione.getIdImmobile());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    @Override
    public void update(Recensione recensione) {
        String query = "UPDATE recensione SET titolo = ?, valutazione = ?, \"idUtente\" = ?, \"idImmobile\" = ? WHERE \"idRecensione\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, recensione.getTitolo());
            statement.setInt(2, recensione.getValutazione());
            statement.setInt(3, recensione.getIdUtente());
            statement.setInt(4, recensione.getIdImmobile());
            statement.setInt(5, recensione.getIdRecensione());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Recensione recensione) {
        String query = "DELETE FROM recensione WHERE \"idRecensione\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, recensione.getIdRecensione());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Recensione mapResultSetToRecensione(ResultSet resultSet) throws SQLException {
        Recensione recensione = new Recensione();
        recensione.setIdRecensione(resultSet.getInt("idRecensione"));
        recensione.setTitolo(resultSet.getString("titolo"));
        recensione.setValutazione(resultSet.getInt("valutazione"));
        // Attenzione: se getAutore è stringa ma la colonna è idUtente (intero), qui potresti avere problemi di tipo.
        // Se la colonna contiene un intero, fai resultSet.getString("idUtente")
        recensione.setIdUtente(resultSet.getInt("idUtente"));
        recensione.setIdImmobile(resultSet.getInt("idImmobile"));
        return recensione;
    }
}