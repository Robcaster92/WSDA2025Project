package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.Bevanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BevandaRepository extends JpaRepository<Bevanda, Long> {
    // Possiamo aggiungere metodi custom se servono, ma per ora basta questo
}