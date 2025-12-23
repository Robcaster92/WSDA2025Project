package org.example.progettofinalerobertocastro.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "parametri_tecnici")
public class ParametriTecnici {

    @Id
    @Column(name = "id_distributore")
    private Long idDistributore;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_distributore")
    private Distributore distributore;

    private Integer temperatura;
    private Integer pressione;

    @Column(name = "acqua_qty")
    private Integer acquaQty;

    @Column(name = "zucchero_qty")
    private Integer zuccheroQty;

    @Column(name = "bicchieri_num")
    private Integer bicchieriNum;

    // --- GETTER E SETTER ---
    public Long getIdDistributore() { return idDistributore; }
    public void setIdDistributore(Long idDistributore) { this.idDistributore = idDistributore; }

    public Distributore getDistributore() { return distributore; }
    public void setDistributore(Distributore distributore) { this.distributore = distributore; }

    public Integer getTemperatura() { return temperatura; }
    public void setTemperatura(Integer temperatura) { this.temperatura = temperatura; }

    public Integer getPressione() { return pressione; }
    public void setPressione(Integer pressione) { this.pressione = pressione; }

    public Integer getAcquaQty() { return acquaQty; }
    public void setAcquaQty(Integer acquaQty) { this.acquaQty = acquaQty; }

    public Integer getZuccheroQty() { return zuccheroQty; }
    public void setZuccheroQty(Integer zuccheroQty) { this.zuccheroQty = zuccheroQty; }

    public Integer getBicchieriNum() { return bicchieriNum; }
    public void setBicchieriNum(Integer bicchieriNum) { this.bicchieriNum = bicchieriNum; }
}