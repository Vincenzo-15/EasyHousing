package com.example.immobiliareClone.persistence.dao.postgres;

import com.example.immobiliareClone.persistence.DBConnection;
import com.example.immobiliareClone.persistence.dao.AstaDao;
import com.example.immobiliareClone.persistence.model.Asta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AstaDaoImpl implements AstaDao {

    @Autowired
    private DBConnection dbConnection;

    @Override
    public List<Asta> findAllAste() {
        List<Asta> aste = new ArrayList<>();
        String query = "SELECT * FROM asta";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query);
             ResultSet rs = st.executeQuery()) {

            while (rs.next()) {
                aste.add(mapResultSetToAsta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return aste;
    }

    @Override
    public Asta findByIdAsta(Integer idAsta) {
        String query = "SELECT * FROM asta WHERE \"idAsta\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setInt(1, idAsta);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToAsta(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Asta findByIdImmobile(Integer idImmobile) {
        String query = "SELECT * FROM asta WHERE \"idImmobile\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setInt(1, idImmobile);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToAsta(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Asta> findByAcquirente(String acquirente) {
        List<Asta> aste = new ArrayList<>();
        String query = "SELECT * FROM asta WHERE acquirente = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setString(1, acquirente);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    aste.add(mapResultSetToAsta(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return aste;
    }

    @Override
    public List<Asta> findByPrezzoOrig(Double prezzoOrig) {
        List<Asta> aste = new ArrayList<>();
        String query = "SELECT * FROM asta WHERE prezzo_orig = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setDouble(1, prezzoOrig);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    aste.add(mapResultSetToAsta(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return aste;
    }

    @Override
    public void save(Asta asta) {
        String query = "INSERT INTO asta (\"idImmobile\", acquirente, prezzo_orig, prezzo_attuale, fine) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setInt(1, asta.getIdImmobile());
            st.setString(2, asta.getAcquirente());
            st.setDouble(3, asta.getPrezzoOrig());
            st.setDouble(4, asta.getPrezzoAttuale());
            st.setTimestamp(5, asta.getFine());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void update(Asta asta) {
        // CORREZIONE: Aggiunte virgolette a "idAsta" nella WHERE
        String query = "UPDATE asta SET \"idImmobile\" = ?, acquirente = ?, prezzo_orig = ?, prezzo_attuale = ?, fine = ? WHERE \"idAsta\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setInt(1, asta.getIdImmobile());
            st.setString(2, asta.getAcquirente());
            st.setDouble(3, asta.getPrezzoOrig());
            st.setDouble(4, asta.getPrezzoAttuale());
            st.setTimestamp(5, asta.getFine());
            st.setInt(6, asta.getIdAsta());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Asta asta) {
        // CORREZIONE: Aggiunte virgolette a "idAsta"
        String query = "DELETE FROM asta WHERE \"idAsta\" = ?";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(query)) {
            st.setInt(1, asta.getIdAsta());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Asta mapResultSetToAsta(ResultSet rs) throws SQLException {
        Asta asta = new Asta();
        asta.setIdAsta(rs.getInt("idAsta"));
        asta.setIdImmobile(rs.getInt("idImmobile"));
        asta.setAcquirente(rs.getString("acquirente"));
        asta.setPrezzoOrig(rs.getDouble("prezzo_orig"));
        asta.setPrezzoAttuale(rs.getDouble("prezzo_attuale"));
        asta.setFine(rs.getTimestamp("fine"));
        return asta;
    }
}