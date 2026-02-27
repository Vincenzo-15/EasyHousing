package com.example.immobiliareClone.persistence.dao.postgres;

import com.example.immobiliareClone.persistence.DBConnection;
import com.example.immobiliareClone.persistence.dao.ImmobileDao;
import com.example.immobiliareClone.persistence.dao.RecensioneDao;
import com.example.immobiliareClone.persistence.model.Immobile;
import com.example.immobiliareClone.persistence.proxy.RecensioniProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ImmobileDaoImpl implements ImmobileDao {

    @Autowired
    private DBConnection dbConnection;

    @Autowired
    private RecensioneDao recensioneDao;

    @Override
    public List<Immobile> findAllImmobili() {
        List<Immobile> immobili = new ArrayList<>();
        String query = "SELECT * FROM immobile";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                immobili.add(mapResultSetToImmobile(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immobili;
    }

    @Override
    public Immobile findByIdImmobile(Integer id) {
        String query = "SELECT * FROM immobile WHERE \"idImmobile\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToImmobile(resultSet);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Immobile> findAllOrderByPrezzoAsc() {
        List<Immobile> immobili = new ArrayList<>();
        // prezzo_attuale è snake_case nel tuo DB, ok senza virgolette
        String query = "SELECT * FROM immobile ORDER BY prezzo_attuale ASC";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                immobili.add(mapResultSetToImmobile(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immobili;
    }

    @Override
    public List<Immobile> findAllOrderByPrezzoDesc() {
        List<Immobile> immobili = new ArrayList<>();
        String query = "SELECT * FROM immobile ORDER BY prezzo_attuale DESC";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                immobili.add(mapResultSetToImmobile(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immobili;
    }

    @Override
    public List<Immobile> findByProprietario(String proprietario) {
        List<Immobile> immobili = new ArrayList<>();
        String query = "SELECT * FROM immobile WHERE proprietario = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, proprietario);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    immobili.add(mapResultSetToImmobile(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immobili;
    }

    @Override
    public List<Immobile> findByTipoAnnuncio(String tipoAnnuncio) {
        List<Immobile> immobili = new ArrayList<>();
        // tipo_annuncio è snake_case nel tuo DB
        String query = "SELECT * FROM immobile WHERE tipo_annuncio = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, tipoAnnuncio);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    immobili.add(mapResultSetToImmobile(resultSet));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return immobili;
    }

    @Override
    public void save(Immobile immobile) {
        // CORREZIONE: Rimossa la colonna "idImmobile" perché è Auto Increment nel DB
        String query = "INSERT INTO immobile (nome, \"tipoImmobile\", prezzo_orig, prezzo_attuale, descrizione, metri_quadri, indirizzo, proprietario, tipo_annuncio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            // Nota: partiamo da index 1 con il 'nome', saltando l'ID
            statement.setString(1, immobile.getNome());
            statement.setString(2, immobile.getTipoImmobile());
            statement.setDouble(3, immobile.getPrezzoOrig());
            statement.setDouble(4, immobile.getPrezzoAttuale());
            statement.setString(5, immobile.getDescrizione());
            statement.setDouble(6, immobile.getMetriQuadri());
            statement.setString(7, immobile.getIndirizzo());
            statement.setString(8, immobile.getProprietario());
            statement.setString(9, immobile.getTipoAnnuncio());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void update(Immobile immobile) {
        String query = "UPDATE immobile SET nome = ?, \"tipoImmobile\" = ?, prezzo_orig = ?, prezzo_attuale = ?, descrizione = ?, metri_quadri = ?, indirizzo = ?, proprietario = ?, tipo_annuncio = ? WHERE \"idImmobile\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setString(1, immobile.getNome());
            statement.setString(2, immobile.getTipoImmobile());
            statement.setDouble(3, immobile.getPrezzoOrig());
            statement.setDouble(4, immobile.getPrezzoAttuale());
            statement.setString(5, immobile.getDescrizione());
            statement.setDouble(6, immobile.getMetriQuadri());
            statement.setString(7, immobile.getIndirizzo());
            statement.setString(8, immobile.getProprietario());
            statement.setString(9, immobile.getTipoAnnuncio());
            statement.setInt(10, immobile.getIdImmobile());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void delete(Immobile immobile) {
        String query = "DELETE FROM immobile WHERE \"idImmobile\" = ?";
        try (Connection conn = dbConnection.getConnection();
             PreparedStatement statement = conn.prepareStatement(query)) {
            statement.setInt(1, immobile.getIdImmobile());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Immobile mapResultSetToImmobile(ResultSet resultSet) throws SQLException {
        Immobile immobile = new Immobile();
        immobile.setIdImmobile(resultSet.getInt("idImmobile"));
        immobile.setNome(resultSet.getString("nome"));

        // Nel DB è "tipoImmobile" (camelCase), quindi nel result set lo chiamiamo così
        immobile.setTipoImmobile(resultSet.getString("tipoImmobile"));

        immobile.setPrezzoOrig(resultSet.getDouble("prezzo_orig"));
        immobile.setPrezzoAttuale(resultSet.getDouble("prezzo_attuale"));
        immobile.setDescrizione(resultSet.getString("descrizione"));
        immobile.setMetriQuadri(resultSet.getFloat("metri_quadri"));
        immobile.setIndirizzo(resultSet.getString("indirizzo"));
        immobile.setProprietario(resultSet.getString("proprietario"));

        // Nel DB è "tipo_annuncio"
        immobile.setTipoAnnuncio(resultSet.getString("tipo_annuncio"));

        // Proxy
        immobile.setRecensioni(new RecensioniProxy(recensioneDao, immobile.getIdImmobile()));

        return immobile;
    }
}