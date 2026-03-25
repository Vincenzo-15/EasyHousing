package com.example.easyHousing.persistence.dao.postgres;

import com.example.easyHousing.persistence.DBConnection;
import com.example.easyHousing.persistence.dao.ImmagineDao;
import com.example.easyHousing.persistence.model.Immagine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ImmagineDaoImpl implements ImmagineDao {

    @Autowired
    private DBConnection dbConnection;

    @Override
    public List<Immagine> findByIdImmobile(Integer idImmobile) {
        List<Immagine> immagini = new ArrayList<>();
        // Forziamo l'ordine esatto delle colonne nella SELECT
        String query = "SELECT \"idImmagine\", \"idImmobile\", immagine FROM immagine WHERE \"idImmobile\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {

            statement.setInt(1, idImmobile);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    immagini.add(mapResultSetToImmagine(resultSet));
                }
            }
        } catch (SQLException e) {
            System.err.println("ERRORE SQL in findByIdImmobile: " + e.getMessage());
            e.printStackTrace();
        }
        return immagini;
    }

    @Override
    public void save(Immagine immagine) {
        String query = "INSERT INTO immagine (\"idImmobile\", immagine) VALUES (?, ?)";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, immagine.getIdImmobile());
            statement.setString(2, immagine.getImmagine());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Immagine immagine) {
        String query = "DELETE FROM immagine WHERE \"idImmagine\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, immagine.getIdImmagine());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Immagine mapResultSetToImmagine(ResultSet resultSet) throws SQLException {
        Immagine immagine = new Immagine();
        // Estrazione sicura tramite numero di colonna
        immagine.setIdImmagine(resultSet.getInt(1));
        immagine.setIdImmobile(resultSet.getInt(2));
        immagine.setImmagine(resultSet.getString(3));
        return immagine;
    }
}