package org.example.progettofinalerobertocastro.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "distributore")
public class Distributore {

    @Id
    @Column(name = "id")
    private Long id; // L'ID del distributore (es. 1012)

    private String modello;
    private String posizione;
    private String stato; // Online/Offline

    @Column(name = "ultima_manutenzione")
    private LocalDate ultimaManutenzione;

    @Column(name = "nome_manutentore")
    private String nomeManutentore = "Non Assegnato"; // Valore di default

    // Relazione 1-a-1 con i Parametri Tecnici
    @OneToOne(mappedBy = "distributore", cascade = CascadeType.ALL)
    private ParametriTecnici parametriTecnici;

    // Relazione con le scorte
    @OneToMany(mappedBy = "distributore", cascade = CascadeType.ALL)
    private List<ScortaBevanda> scorte;

    // Relazione con i guasti
    @OneToMany(mappedBy = "distributore", cascade = CascadeType.ALL)
    private List<Guasto> guasti;

    // --- GETTER E SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModello() { return modello; }
    public void setModello(String modello) { this.modello = modello; }

    public String getPosizione() { return posizione; }
    public void setPosizione(String posizione) { this.posizione = posizione; }

    public String getStato() { return stato; }
    public void setStato(String stato) { this.stato = stato; }

    public LocalDate getUltimaManutenzione() { return ultimaManutenzione; }
    public void setUltimaManutenzione(LocalDate ultimaManutenzione) { this.ultimaManutenzione = ultimaManutenzione; }

    public ParametriTecnici getParametriTecnici() { return parametriTecnici; }
    public void setParametriTecnici(ParametriTecnici parametriTecnici) { this.parametriTecnici = parametriTecnici; }

    public List<ScortaBevanda> getScorte() { return scorte; }
    public void setScorte(List<ScortaBevanda> scorte) { this.scorte = scorte; }

    public List<Guasto> getGuasti() { return guasti; }
    public void setGuasti(List<Guasto> guasti) { this.guasti = guasti; }

    public String getNomeManutentore() {
        return nomeManutentore;
    }

    public void setNomeManutentore(String nomeManutentore) {
        this.nomeManutentore = nomeManutentore;
    }
}