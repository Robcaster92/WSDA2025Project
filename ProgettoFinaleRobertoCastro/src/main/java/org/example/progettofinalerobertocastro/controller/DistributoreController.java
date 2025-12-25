package org.example.progettofinalerobertocastro.controller;

import org.example.progettofinalerobertocastro.entity.Distributore;
import org.example.progettofinalerobertocastro.entity.ScortaBevanda;
import org.example.progettofinalerobertocastro.entity.Utente;
import org.example.progettofinalerobertocastro.repository.DistributoreRepository;
import org.example.progettofinalerobertocastro.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/distributore")
@CrossOrigin(origins = "*")
public class DistributoreController {

    @Autowired
    private DistributoreRepository distributoreRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    // ==================================================================
    // 1. SEZIONE GESTORE (NECESSARIA PER LA LISTA E L'AGGIUNTA)
    // ==================================================================

    // GET ALL: Restituisce la lista per la tabella
    @GetMapping("/all")
    public List<Distributore> getAllDistributori() {
        return distributoreRepository.findAll();
    }

    // POST: Crea un nuovo distributore
    @PostMapping
    public ResponseEntity<?> creaDistributore(@RequestBody Distributore distributore) {
        if (distributore.getId() == null) {
            return ResponseEntity.badRequest().body("L'ID è obbligatorio.");
        }
        if (distributoreRepository.existsById(distributore.getId())) {
            return ResponseEntity.badRequest().body("Errore: ID " + distributore.getId() + " già esistente!");
        }

        // Valori default
        if (distributore.getStato() == null || distributore.getStato().isEmpty()) distributore.setStato("Online");
        if (distributore.getNomeManutentore() == null || distributore.getNomeManutentore().isEmpty()) distributore.setNomeManutentore("Non Assegnato");

        distributoreRepository.save(distributore);
        return ResponseEntity.ok("Distributore aggiunto con successo");
    }

    // DELETE: Elimina distributore
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminaDistributore(@PathVariable Long id) {
        if (distributoreRepository.existsById(id)) {
            distributoreRepository.deleteById(id);
            return ResponseEntity.ok("Eliminato.");
        }
        return ResponseEntity.status(404).body("Non trovato.");
    }

    // ==================================================================
    // 2. SEZIONE ORIGINALE (PER UTENTE E MANUTENTORE) - INVARIATA
    // ==================================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getStatoDistributore(@PathVariable Long id) {
        Optional<Distributore> distributore = distributoreRepository.findById(id);
        if (distributore.isPresent()) {
            return ResponseEntity.ok(distributore.get());
        } else {
            return ResponseEntity.status(404).body("Distributore non trovato");
        }
    }

    @GetMapping("/{idDistributore}/utente")
    public ResponseEntity<?> getUtenteConnesso(@PathVariable Long idDistributore) {
        Optional<Utente> utente = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();
        if (utente.isPresent()) return ResponseEntity.ok(utente.get());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{idDistributore}/eroga")
    public ResponseEntity<String> erogaBevanda(@PathVariable Long idDistributore, @RequestParam Long bevandaId) {
        Optional<Distributore> dOpt = distributoreRepository.findById(idDistributore);
        if (dOpt.isEmpty()) return ResponseEntity.badRequest().body("Distributore non trovato");
        Distributore distributore = dOpt.get();

        Optional<Utente> uOpt = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();
        if (uOpt.isEmpty()) return ResponseEntity.badRequest().body("Nessun utente connesso!");
        Utente utente = uOpt.get();

        Optional<ScortaBevanda> sOpt = distributore.getScorte().stream()
                .filter(s -> s.getBevanda().getId().equals(bevandaId))
                .findFirst();
        if (sOpt.isEmpty()) return ResponseEntity.badRequest().body("Bevanda non disponibile");
        ScortaBevanda scorta = sOpt.get();

        if (utente.getCredito() < scorta.getBevanda().getPrezzo()) return ResponseEntity.badRequest().body("Credito insufficiente!");
        if (scorta.getQuantita() <= 0) return ResponseEntity.badRequest().body("Bevanda esaurita!");

        utente.setCredito(utente.getCredito() - scorta.getBevanda().getPrezzo());
        scorta.setQuantita(scorta.getQuantita() - 1);

        utenteRepository.save(utente);
        distributoreRepository.save(distributore);

        return ResponseEntity.ok("Erogazione completata! Credito residuo: " + utente.getCredito());
    }
}