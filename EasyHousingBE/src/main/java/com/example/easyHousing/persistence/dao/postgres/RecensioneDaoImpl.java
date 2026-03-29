package com.example.easyHousing.persistence.dao.postgres;

import com.example.easyHousing.persistence.DBConnection;
import com.example.easyHousing.persistence.dao.RecensioneDao;
import com.example.easyHousing.persistence.model.Recensione;
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
        // Aggiunto 'testo' nella query
        String query = "INSERT INTO recensione (titolo, testo, valutazione, \"idUtente\", \"idImmobile\") VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {

            statement.setString(1, recensione.getTitolo());
            statement.setString(2, recensione.getTesto()); // <--- SALVA IL TESTO
            statement.setInt(3, recensione.getValutazione());
            statement.setInt(4, recensione.getIdUtente());
            statement.setInt(5, recensione.getIdImmobile());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void update(Recensione recensione) {
        // Aggiunto 'testo' nella query
        String query = "UPDATE recensione SET titolo = ?, testo = ?, valutazione = ?, \"idUtente\" = ?, \"idImmobile\" = ? WHERE \"idRecensione\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {

            statement.setString(1, recensione.getTitolo());
            statement.setString(2, recensione.getTesto()); // <--- AGGIORNA IL TESTO
            statement.setInt(3, recensione.getValutazione());
            statement.setInt(4, recensione.getIdUtente());
            statement.setInt(5, recensione.getIdImmobile());
            statement.setInt(6, recensione.getIdRecensione());
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

        // ESTRAE IL TESTO DAL DATABASE
        recensione.setTesto(resultSet.getString("testo"));

        recensione.setValutazione(resultSet.getInt("valutazione"));
        recensione.setIdUtente(resultSet.getInt("idUtente"));
        recensione.setIdImmobile(resultSet.getInt("idImmobile"));
        return recensione;
    }
}