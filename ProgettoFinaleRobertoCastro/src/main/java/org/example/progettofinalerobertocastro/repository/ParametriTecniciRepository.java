package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.ParametriTecnici;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametriTecniciRepository extends JpaRepository<ParametriTecnici, Long> {
}