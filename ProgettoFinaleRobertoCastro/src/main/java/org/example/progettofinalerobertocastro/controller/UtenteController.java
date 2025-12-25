package org.example.progettofinalerobertocastro.controller;

import org.example.progettofinalerobertocastro.entity.Utente;
import org.example.progettofinalerobertocastro.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utente")
@CrossOrigin(origins = "*")
public class UtenteController {

    @Autowired
    private UtenteRepository utenteRepository;

    // 1. LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Utente loginRequest) {
        // CORREZIONE: Usa findByUsername
        Optional<Utente> utente = utenteRepository.findByUsername(loginRequest.getUsername());

        if (utente.isPresent() && utente.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(utente.get());
        }
        return ResponseEntity.status(401).body("Credenziali non valide");
    }

    // 2. INFO UTENTE
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestParam String username) {
        Optional<Utente> utente = utenteRepository.findByUsername(username);
        if (utente.isPresent()) {
            return ResponseEntity.ok(utente.get());
        }
        return ResponseEntity.status(404).body("Utente non trovato");
    }

    // 3. GET LISTA MANUTENTORI
    @GetMapping("/manutentori")
    public List<Utente> getManutentori() {
        return utenteRepository.findByRuolo("MANUTENTORE");
    }

    // 4. REGISTRAZIONE
    @PostMapping("/registra")
    public ResponseEntity<?> registraUtente(@RequestBody Utente nuovoUtente) {
        if (utenteRepository.existsByUsername(nuovoUtente.getUsername())) {
            return ResponseEntity.badRequest().body("Username già esistente!");
        }
        if (nuovoUtente.getRuolo() == null) {
            nuovoUtente.setRuolo("CLIENTE");
        }
        utenteRepository.save(nuovoUtente);
        return ResponseEntity.ok("Utente registrato con successo");
    }

    // 5. ELIMINA UTENTE
    @DeleteMapping("/{username}")
    @Transactional // Necessario per deleteByUsername
    public ResponseEntity<?> eliminaUtente(@PathVariable String username) {
        if (utenteRepository.existsByUsername(username)) {
            utenteRepository.deleteByUsername(username);
            return ResponseEntity.ok("Utente eliminato.");
        }
        return ResponseEntity.status(404).body("Utente non trovato.");
    }
}