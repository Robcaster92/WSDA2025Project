package org.example.progettofinalerobertocastro.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "scorta_bevanda")
public class ScortaBevanda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_distributore")
    @JsonIgnore
    private Distributore distributore;

    @ManyToOne
    @JoinColumn(name = "id_bevanda")
    private Bevanda bevanda;

    private Integer quantita; // Quantity attuale

    @Column(name = "max_quantita")
    private Integer maxQuantita; // MaxQuantity

    // --- GETTER E SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Distributore getDistributore() { return distributore; }
    public void setDistributore(Distributore distributore) { this.distributore = distributore; }

    public Bevanda getBevanda() { return bevanda; }
    public void setBevanda(Bevanda bevanda) { this.bevanda = bevanda; }

    public Integer getQuantita() { return quantita; }
    public void setQuantita(Integer quantita) { this.quantita = quantita; }

    public Integer getMaxQuantita() { return maxQuantita; }
    public void setMaxQuantita(Integer maxQuantita) { this.maxQuantita = maxQuantita; }
}