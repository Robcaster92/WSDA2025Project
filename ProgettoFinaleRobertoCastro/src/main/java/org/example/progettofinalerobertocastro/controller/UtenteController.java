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
}