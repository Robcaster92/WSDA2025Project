package org.example.progettofinalerobertocastro.repository;

import org.example.progettofinalerobertocastro.entity.Distributore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistributoreRepository extends JpaRepository<Distributore, Long> {

}