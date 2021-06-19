package br.com.vacinacao.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Fabricante.
 */
@Entity
@Table(name = "fabricante")
public class Fabricante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "criado")
    private ZonedDateTime criado;

    @ManyToMany
    @JoinTable(
        name = "rel_fabricante__vacinas",
        joinColumns = @JoinColumn(name = "fabricante_id"),
        inverseJoinColumns = @JoinColumn(name = "vacinas_id")
    )
    @JsonIgnoreProperties(value = { "doenca", "fbricantes" }, allowSetters = true)
    private Set<Vacina> vacinas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Fabricante id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Fabricante nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ZonedDateTime getCriado() {
        return this.criado;
    }

    public Fabricante criado(ZonedDateTime criado) {
        this.criado = criado;
        return this;
    }

    public void setCriado(ZonedDateTime criado) {
        this.criado = criado;
    }

    public Set<Vacina> getVacinas() {
        return this.vacinas;
    }

    public Fabricante vacinas(Set<Vacina> vacinas) {
        this.setVacinas(vacinas);
        return this;
    }

    public Fabricante addVacinas(Vacina vacina) {
        this.vacinas.add(vacina);
        vacina.getFbricantes().add(this);
        return this;
    }

    public Fabricante removeVacinas(Vacina vacina) {
        this.vacinas.remove(vacina);
        vacina.getFbricantes().remove(this);
        return this;
    }

    public void setVacinas(Set<Vacina> vacinas) {
        this.vacinas = vacinas;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fabricante)) {
            return false;
        }
        return id != null && id.equals(((Fabricante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fabricante{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", criado='" + getCriado() + "'" +
            "}";
    }
}
