package org.example.progettofinalerobertocastro.controller;

import org.example.progettofinalerobertocastro.entity.Distributore;
import org.example.progettofinalerobertocastro.entity.ScortaBevanda;
import org.example.progettofinalerobertocastro.entity.Utente;
import org.example.progettofinalerobertocastro.repository.DistributoreRepository;
import org.example.progettofinalerobertocastro.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/distributore")
@CrossOrigin(origins = "*") // Importante per il frontend
public class DistributoreController {

    @Autowired
    private DistributoreRepository distributoreRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    // === MANUTENTORE: Ottiene TUTTI i dati della macchina (Stato, Scorte, Errori) ===
    // Chiamata: GET http://localhost:8081/api/distributore/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getStatoDistributore(@PathVariable Long id) {
        Optional<Distributore> distributore = distributoreRepository.findById(id);

        if (distributore.isPresent()) {
            return ResponseEntity.ok(distributore.get());
        } else {
            return ResponseEntity.status(404).body("Distributore non trovato");
        }
    }

    // === UTENTE: Sapere chi è connesso ===
    @GetMapping("/{idDistributore}/utente")
    public ResponseEntity<?> getUtenteConnesso(@PathVariable Long idDistributore) {
        Optional<Utente> utente = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();

        if (utente.isPresent()) {
            return ResponseEntity.ok(utente.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    // === UTENTE: Erogazione Bevanda ===
    @PostMapping("/{idDistributore}/eroga")
    public ResponseEntity<String> erogaBevanda(
            @PathVariable Long idDistributore,
            @RequestParam Long bevandaId) {

        Optional<Distributore> distributoreOpt = distributoreRepository.findById(idDistributore);
        if (distributoreOpt.isEmpty()) return ResponseEntity.badRequest().body("Distributore non trovato");
        Distributore distributore = distributoreOpt.get();

        Optional<Utente> utenteOpt = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();

        if (utenteOpt.isEmpty()) return ResponseEntity.badRequest().body("Nessun utente connesso!");
        Utente utente = utenteOpt.get();

        Optional<ScortaBevanda> scortaOpt = distributore.getScorte().stream()
                .filter(s -> s.getBevanda().getId().equals(bevandaId))
                .findFirst();

        if (scortaOpt.isEmpty()) return ResponseEntity.badRequest().body("Bevanda non disponibile");
        ScortaBevanda scorta = scortaOpt.get();

        double prezzo = scorta.getBevanda().getPrezzo();
        if (utente.getCredito() < prezzo) {
            return ResponseEntity.badRequest().body("Credito insufficiente!");
        }
        if (scorta.getQuantita() <= 0) {
            return ResponseEntity.badRequest().body("Bevanda esaurita!");
        }

        // Transazione: Scala credito e scorta
        utente.setCredito(utente.getCredito() - prezzo);
        scorta.setQuantita(scorta.getQuantita() - 1);

        utenteRepository.save(utente);
        distributoreRepository.save(distributore);

        return ResponseEntity.ok("Erogazione completata! Credito residuo: " + utente.getCredito());
    }
}