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

    // API per ottenere i dati dell'utente (Sostituisce la lettura di dati.json)
    // Chiama: GET http://localhost:8081/api/utente/info?username=Rob92
    @GetMapping("/utente/info")
    public ResponseEntity<?> getUtenteInfo(@RequestParam String username) {
        Optional<Utente> utente = utenteRepository.findByUsername(username);
        if (utente.isPresent()) {
            // Restituisce un JSON con nome e credito aggiornati dal DB
            return ResponseEntity.ok(Map.of(
                    "user_name", utente.get().getNome(),
                    "credito", utente.get().getCredito()
            ));
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
    // === REGISTRAZIONE ===
    // Chiamata: POST http://localhost:8081/api/utente/register
    @PostMapping("/register")
    public ResponseEntity<?> registraUtente(@RequestBody Utente nuovoUtente) {
        // 1. Controlla se esiste già
        if (utenteRepository.findByEmail(nuovoUtente.getEmail()).isPresent() ||
                utenteRepository.findByUsername(nuovoUtente.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Errore: Email o Username già in uso!");
        }

        // 2. Imposta credito iniziale a 0 se nullo
        if (nuovoUtente.getCredito() == null) {
            nuovoUtente.setCredito(0.0);
        }

        // 3. Salva nel DB (password in chiaro come richiesto)
        utenteRepository.save(nuovoUtente);
        return ResponseEntity.ok("Registrazione avvenuta con successo!");
    }

    // === LOGIN ===
    // Chiamata: POST http://localhost:8081/api/utente/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUtente(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<Utente> utenteTrovato = utenteRepository.findByUsernameAndPassword(username, password);

        if (utenteTrovato.isPresent()) {
            // Ritorna i dati dell'utente (senza password per sicurezza, se vuoi pulire il JSON)
            return ResponseEntity.ok(utenteTrovato.get());
        } else {
            return ResponseEntity.status(401).body("Credenziali non valide");
        }
    }
}