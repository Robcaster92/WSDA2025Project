package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {

    // CERCA TRAMITE USERNAME (Non usare findById per lo username!)
    Optional<Utente> findByUsername(String username);

    // CONTROLLA ESISTENZA TRAMITE USERNAME
    boolean existsByUsername(String username);

    // Trova utenti in base al ruolo
    List<Utente> findByRuolo(String ruolo);

    // Elimina usando lo username
    void deleteByUsername(String username);
}