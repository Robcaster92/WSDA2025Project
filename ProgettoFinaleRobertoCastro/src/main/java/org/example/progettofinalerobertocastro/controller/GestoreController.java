package org.example.progettofinalerobertocastro.controller;

import org.example.progettofinalerobertocastro.entity.Distributore;
import org.example.progettofinalerobertocastro.repository.DistributoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gestore")
@CrossOrigin(origins = "*")
public class GestoreController {

    @Autowired
    private DistributoreRepository distributoreRepository;

    @GetMapping("/distributori")
    public List<Distributore> getTuttiDistributori() {
        return distributoreRepository.findAll();
    }

    @PostMapping("/distributori")
    public Distributore aggiungiDistributore(@RequestBody Distributore d) {
        if(d.getStato() == null) d.setStato("Offline");
        if(d.getPosizione() == null) d.setPosizione("Magazzino");
        if(d.getModello() == null) d.setModello("Standard");
        return distributoreRepository.save(d);
    }

    @DeleteMapping("/distributori/{id}")
    public void rimuoviDistributore(@PathVariable Long id) {
        distributoreRepository.deleteById(id);
    }
}