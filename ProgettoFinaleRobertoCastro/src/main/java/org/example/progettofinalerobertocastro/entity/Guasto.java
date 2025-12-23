package org.example.progettofinalerobertocastro.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guasto")
public class Guasto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_distributore")
    private Distributore distributore;

    private String messaggio;

    @Column(name = "data_segnalazione")
    private LocalDateTime dataSegnalazione;

    // --- GETTER E SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Distributore getDistributore() { return distributore; }
    public void setDistributore(Distributore distributore) { this.distributore = distributore; }

    public String getMessaggio() { return messaggio; }
    public void setMessaggio(String messaggio) { this.messaggio = messaggio; }

    public LocalDateTime getDataSegnalazione() { return dataSegnalazione; }
    public void setDataSegnalazione(LocalDateTime dataSegnalazione) { this.dataSegnalazione = dataSegnalazione; }
}