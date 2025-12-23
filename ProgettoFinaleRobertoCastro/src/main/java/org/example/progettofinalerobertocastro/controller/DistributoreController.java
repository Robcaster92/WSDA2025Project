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
@RequestMapping("/api/distributore") // Tutte le richieste inizieranno con questa URL
@CrossOrigin(origins = "*") // Importante: permette al tuo JavaScript (frontend) di chiamare questo backend
public class DistributoreController {

    @Autowired
    private DistributoreRepository distributoreRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    // === REQUISITO 1: Sapere chi è l'utente connesso  ===
    // Il JS chiamerà: GET /api/distributore/1012/utente
    @GetMapping("/{idDistributore}/utente")
    public ResponseEntity<?> getUtenteConnesso(@PathVariable Long idDistributore) {

        // Cerchiamo nel DB se c'è un utente connesso a QUESTA macchinetta
        // Nota: Nel DB abbiamo messo il campo 'id_distributore_connesso' nell'Utente.
        // Qui stiamo facendo una query manuale un po' grezza, in futuro useremo una query repository specifica.
        // Per ora cerchiamo tra tutti gli utenti quello collegato a questo ID.

        Optional<Utente> utente = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();

        if (utente.isPresent()) {
            return ResponseEntity.ok(utente.get()); // Restituisce il JSON dell'utente (credito, nome, ecc.)
        } else {
            return ResponseEntity.noContent().build(); // Nessuno connesso
        }
    }

    // === REQUISITO 2: Erogazione Bevanda  ===
    // Il JS chiamerà: POST /api/distributore/1012/eroga?bevandaId=1
    @PostMapping("/{idDistributore}/eroga")
    public ResponseEntity<String> erogaBevanda(
            @PathVariable Long idDistributore,
            @RequestParam Long bevandaId) {

        // 1. Trova il distributore
        Optional<Distributore> distributoreOpt = distributoreRepository.findById(idDistributore);
        if (distributoreOpt.isEmpty()) return ResponseEntity.badRequest().body("Distributore non trovato");
        Distributore distributore = distributoreOpt.get();

        // 2. Trova l'utente connesso a questo distributore
        Optional<Utente> utenteOpt = utenteRepository.findAll().stream()
                .filter(u -> idDistributore.equals(u.getIdDistributoreConnesso()))
                .findFirst();

        if (utenteOpt.isEmpty()) return ResponseEntity.badRequest().body("Nessun utente connesso!");
        Utente utente = utenteOpt.get();

        // 3. Trova la scorta della bevanda richiesta
        Optional<ScortaBevanda> scortaOpt = distributore.getScorte().stream()
                .filter(s -> s.getBevanda().getId().equals(bevandaId))
                .findFirst();

        if (scortaOpt.isEmpty()) return ResponseEntity.badRequest().body("Bevanda non disponibile");
        ScortaBevanda scorta = scortaOpt.get();

        // 4. CONTROLLI: Credito sufficiente? Scorte sufficienti?
        double prezzo = scorta.getBevanda().getPrezzo();
        if (utente.getCredito() < prezzo) {
            return ResponseEntity.badRequest().body("Credito insufficiente!");
        }
        if (scorta.getQuantita() <= 0) {
            return ResponseEntity.badRequest().body("Bevanda esaurita!");
        }

        // 5. TRANSAZIONE: Scala credito e scorte
        utente.setCredito(utente.getCredito() - prezzo);
        scorta.setQuantita(scorta.getQuantita() - 1);

        // Se scende sotto il livello di guardia, potremmo generare un guasto qui (opzionale)

        // 6. Salva le modifiche nel DB
        utenteRepository.save(utente);
        distributoreRepository.save(distributore);

        return ResponseEntity.ok("Erogazione completata! Credito residuo: " + utente.getCredito());
    }
}