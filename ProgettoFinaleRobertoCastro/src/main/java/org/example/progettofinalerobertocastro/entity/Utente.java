package org.example.progettofinalerobertocastro.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "utente")
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String ruolo; // 'CLIENTE', 'MANUTENTORE', 'GESTORE'
    private String nome;
    private String cognome;
    private Double credito;

    @Column(name = "id_distributore_connesso")
    private Long idDistributoreConnesso;

    // --- GETTER E SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRuolo() { return ruolo; }
    public void setRuolo(String ruolo) { this.ruolo = ruolo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }

    public Double getCredito() { return credito; }
    public void setCredito(Double credito) { this.credito = credito; }

    public Long getIdDistributoreConnesso() { return idDistributoreConnesso; }
    public void setIdDistributoreConnesso(Long idDistributoreConnesso) { this.idDistributoreConnesso = idDistributoreConnesso; }
}