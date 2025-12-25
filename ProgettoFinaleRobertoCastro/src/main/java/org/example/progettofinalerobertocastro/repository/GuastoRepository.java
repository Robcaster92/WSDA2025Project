package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.Guasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuastoRepository extends JpaRepository<Guasto, Long> {
    // Trova tutti i guasti di un distributore
    List<Guasto> findByDistributoreId(Long idDistributore);
}