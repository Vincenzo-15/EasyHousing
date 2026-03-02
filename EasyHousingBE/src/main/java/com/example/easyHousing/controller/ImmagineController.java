package com.example.easyHousing.controller;

import com.example.easyHousing.exception.exceptions.RecordNotFoundException;
import com.example.easyHousing.persistence.model.Immagine;
import com.example.easyHousing.service.ImmagineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/immagini")
@CrossOrigin(origins = "http://localhost:4200")
public class ImmagineController {

    @Autowired
    private ImmagineService immagineService;

    @GetMapping("/findByIdImmobile/{idImmobile}")
    public List<Immagine> findByIdImmobile(@PathVariable Integer idImmobile) throws RecordNotFoundException {
        return immagineService.getImmaginiByIdImmobili(idImmobile);
    }

    // CORREZIONE POST
    @PostMapping("/upload")
    public void uploadImmagine(@RequestParam("idImmobile") Integer idImmobile,
                               @RequestParam("file") MultipartFile file) throws IOException, RecordNotFoundException {

        // 1. Definisci il percorso
        String cartellaUpload = System.getProperty("user.dir") + "/uploads/";

        // === NUOVO CODICE: Crea la cartella se non esiste ===
        Path cartellaPath = Paths.get(cartellaUpload);
        if (!Files.exists(cartellaPath)) {
            Files.createDirectories(cartellaPath);
        }
        // ====================================================

        // 2. Genera nome file
        String nomeFileOriginale = file.getOriginalFilename();
        String estensione = nomeFileOriginale != null && nomeFileOriginale.contains(".")
                ? nomeFileOriginale.substring(nomeFileOriginale.lastIndexOf("."))
                : ".jpg";
        String nomeFileUnico = UUID.randomUUID().toString() + estensione;

        // 3. Salva
        Path path = Paths.get(cartellaUpload + nomeFileUnico);
        Files.write(path, file.getBytes());

        // 4. Crea oggetto Immagine
        Immagine imgObj = new Immagine();
        imgObj.setIdImmobile(idImmobile);
        imgObj.setImmagine("http://localhost:8080/foto-immobili/" + nomeFileUnico);

        // 5. Salva DB
        immagineService.creaImmagine(imgObj);
    }

    // CORREZIONE DELETE per ID
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) throws RecordNotFoundException  {
        Immagine immagine = new Immagine();
        immagine.setIdImmagine(id);
        immagineService.eliminaImmagine(immagine);
    }
}