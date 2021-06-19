package br.com.vacinacao.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A RegistroVacinacao.
 */
@Entity
@Table(name = "registro_vacinacao")
public class RegistroVacinacao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "dia")
    private LocalDate dia;

    @Column(name = "cns")
    private String cns;

    @Column(name = "enfermeiro")
    private String enfermeiro;

    @ManyToOne
    private Pessoa pessoa;

    @ManyToOne
    @JsonIgnoreProperties(value = { "doenca", "fbricantes" }, allowSetters = true)
    private Vacina vacina;

    @ManyToOne
    @JsonIgnoreProperties(value = { "vacinas" }, allowSetters = true)
    private Fabricante fabricante;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RegistroVacinacao id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDia() {
        return this.dia;
    }

    public RegistroVacinacao dia(LocalDate dia) {
        this.dia = dia;
        return this;
    }

    public void setDia(LocalDate dia) {
        this.dia = dia;
    }

    public String getCns() {
        return this.cns;
    }

    public RegistroVacinacao cns(String cns) {
        this.cns = cns;
        return this;
    }

    public void setCns(String cns) {
        this.cns = cns;
    }

    public String getEnfermeiro() {
        return this.enfermeiro;
    }

    public RegistroVacinacao enfermeiro(String enfermeiro) {
        this.enfermeiro = enfermeiro;
        return this;
    }

    public void setEnfermeiro(String enfermeiro) {
        this.enfermeiro = enfermeiro;
    }

    public Pessoa getPessoa() {
        return this.pessoa;
    }

    public RegistroVacinacao pessoa(Pessoa pessoa) {
        this.setPessoa(pessoa);
        return this;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Vacina getVacina() {
        return this.vacina;
    }

    public RegistroVacinacao vacina(Vacina vacina) {
        this.setVacina(vacina);
        return this;
    }

    public void setVacina(Vacina vacina) {
        this.vacina = vacina;
    }

    public Fabricante getFabricante() {
        return this.fabricante;
    }

    public RegistroVacinacao fabricante(Fabricante fabricante) {
        this.setFabricante(fabricante);
        return this;
    }

    public void setFabricante(Fabricante fabricante) {
        this.fabricante = fabricante;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegistroVacinacao)) {
            return false;
        }
        return id != null && id.equals(((RegistroVacinacao) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RegistroVacinacao{" +
            "id=" + getId() +
            ", dia='" + getDia() + "'" +
            ", cns='" + getCns() + "'" +
            ", enfermeiro='" + getEnfermeiro() + "'" +
            "}";
    }
}
