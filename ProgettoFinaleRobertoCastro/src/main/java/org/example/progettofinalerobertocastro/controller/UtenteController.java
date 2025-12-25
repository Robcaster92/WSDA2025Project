package org.example.progettofinalerobertocastro.controller;

import org.example.progettofinalerobertocastro.entity.Utente;
import org.example.progettofinalerobertocastro.repository.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Fondamentale per far funzionare il JS
public class UtenteController {

    @Autowired
    private UtenteRepository utenteRepository;
    
    @GetMapping("/utente/info")
    public ResponseEntity<?> getUtenteInfo(@RequestParam String username) {
        Optional<Utente> utente = utenteRepository.findByUsername(username);
        if (utente.isPresent()) {
            Utente u = utente.get();

            // USA HASHMAP AL POSTO DI MAP.OF PER EVITARE CRASH SU NULL
            java.util.Map<String, Object> risposta = new java.util.HashMap<>();
            risposta.put("user_name", u.getNome() != null ? u.getNome() : "Utente"); // Default se null
            risposta.put("credito", u.getCredito() != null ? u.getCredito() : 0.0);

            return ResponseEntity.ok(risposta);
        }
        return ResponseEntity.notFound().build();
    }

    // API per la Ricarica (Quella che cercava il tuo JS)
    // Chiama: POST http://localhost:8081/api/ricarica
    @PostMapping("/ricarica")
    public ResponseEntity<?> ricaricaCredito(@RequestBody Map<String, Object> payload) {
        // In un caso reale prenderesti l'ID dalla sessione. Qui usiamo un utente fisso o passato nel payload.
        // Per semplicità, ricarichiamo l'utente "Rob92" (o il primo che troviamo)
        String username = "Rob92"; // O prendilo da payload.get("username")
        Double importo = Double.valueOf(payload.get("importo").toString());

        Optional<Utente> utenteOpt = utenteRepository.findByUsername(username);

        if (utenteOpt.isPresent()) {
            Utente utente = utenteOpt.get();
            utente.setCredito(utente.getCredito() + importo);
            utenteRepository.save(utente); // Salva nel Database MySQL

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "nuovo_credito", utente.getCredito()
            ));
        }
        return ResponseEntity.badRequest().body("Utente non trovato");
    }
    // === REGISTRAZIONE UNIFICATA ===
    @PostMapping("/utente/register")
    public ResponseEntity<?> registraUtente(@RequestBody Utente nuovoUtente) {
        // Controllo esistenza
        if (utenteRepository.findByEmail(nuovoUtente.getEmail()).isPresent() ||
                utenteRepository.findByUsername(nuovoUtente.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Errore: Email o Username già in uso!");
        }

        // Imposta valori di default
        if (nuovoUtente.getCredito() == null) nuovoUtente.setCredito(0.0);

        // Se il ruolo non è specificato, di base è CLIENTE
        if (nuovoUtente.getRuolo() == null || nuovoUtente.getRuolo().isEmpty()) {
            nuovoUtente.setRuolo("CLIENTE");
        }

        utenteRepository.save(nuovoUtente);
        return ResponseEntity.ok("Registrazione avvenuta con successo!");
    }

    // === LOGIN UNIFICATO ===
    @PostMapping("/utente/login")
    public ResponseEntity<?> loginUtente(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<Utente> utenteTrovato = utenteRepository.findByUsernameAndPassword(username, password);

        if (utenteTrovato.isPresent()) {
            // Restituisce l'oggetto utente COMPLETO, incluso il RUOLO
            return ResponseEntity.ok(utenteTrovato.get());
        } else {
            return ResponseEntity.status(401).body("Credenziali non valide");
        }
    }
}