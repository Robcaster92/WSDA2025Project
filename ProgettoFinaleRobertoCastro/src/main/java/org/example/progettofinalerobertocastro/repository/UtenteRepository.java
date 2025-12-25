package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {
    // Cerca per username (già usato)
    Optional<Utente> findByUsername(String username);

    // Cerca per Email (per la registrazione, per evitare duplicati)
    Optional<Utente> findByEmail(String email);

    // Cerca per Login (Username e Password)
    Optional<Utente> findByUsernameAndPassword(String username, String password);
}