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
        // CORREZIONE: Aggiunte virgolette attorno a "idImmobile"
        String query = "SELECT * FROM immagine WHERE \"idImmobile\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, idImmobile);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    immagini.add(mapResultSetToImmagine(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immagini;
    }

    @Override
    public void save(Immagine immagine) {
        // CORREZIONE 1: Aggiunte virgolette a "idImmobile"
        // CORREZIONE 2: Ho RIMOSSO "idImmagine" dalla INSERT.
        // Essendo Auto-Increment nel DB, ci pensa Postgres a generarlo.
        String query = "INSERT INTO immagine (\"idImmobile\", immagine) VALUES (?, ?)";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            // Nota: ora abbiamo solo 2 parametri, l'ID si genera da solo
            statement.setInt(1, immagine.getIdImmobile());
            statement.setString(2, immagine.getImmagine());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Immagine immagine) {
        // CORREZIONE: Aggiunte virgolette attorno a "idImmagine"
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
        // CORREZIONE: Usiamo i nomi esatti delle colonne come nel DB
        immagine.setIdImmagine(resultSet.getInt("idImmagine"));
        immagine.setIdImmobile(resultSet.getInt("idImmobile"));
        immagine.setImmagine(resultSet.getString("immagine"));
        return immagine;
    }
}