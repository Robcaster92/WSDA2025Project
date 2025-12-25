package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.ScortaBevanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScortaBevandaRepository extends JpaRepository<ScortaBevanda, Long> {
    // Trova tutte le scorte di un distributore specifico
    List<ScortaBevanda> findByDistributoreId(Long idDistributore);
}