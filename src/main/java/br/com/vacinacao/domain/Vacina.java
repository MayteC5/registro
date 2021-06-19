package br.com.vacinacao.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Vacina.
 */
@Entity
@Table(name = "vacina")
public class Vacina implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "criada")
    private ZonedDateTime criada;

    @ManyToOne
    private Doenca doenca;

    @ManyToMany(mappedBy = "vacinas")
    @JsonIgnoreProperties(value = { "vacinas" }, allowSetters = true)
    private Set<Fabricante> fbricantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vacina id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Vacina nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public ZonedDateTime getCriada() {
        return this.criada;
    }

    public Vacina criada(ZonedDateTime criada) {
        this.criada = criada;
        return this;
    }

    public void setCriada(ZonedDateTime criada) {
        this.criada = criada;
    }

    public Doenca getDoenca() {
        return this.doenca;
    }

    public Vacina doenca(Doenca doenca) {
        this.setDoenca(doenca);
        return this;
    }

    public void setDoenca(Doenca doenca) {
        this.doenca = doenca;
    }

    public Set<Fabricante> getFbricantes() {
        return this.fbricantes;
    }

    public Vacina fbricantes(Set<Fabricante> fabricantes) {
        this.setFbricantes(fabricantes);
        return this;
    }

    public Vacina addFbricantes(Fabricante fabricante) {
        this.fbricantes.add(fabricante);
        fabricante.getVacinas().add(this);
        return this;
    }

    public Vacina removeFbricantes(Fabricante fabricante) {
        this.fbricantes.remove(fabricante);
        fabricante.getVacinas().remove(this);
        return this;
    }

    public void setFbricantes(Set<Fabricante> fabricantes) {
        if (this.fbricantes != null) {
            this.fbricantes.forEach(i -> i.removeVacinas(this));
        }
        if (fabricantes != null) {
            fabricantes.forEach(i -> i.addVacinas(this));
        }
        this.fbricantes = fabricantes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vacina)) {
            return false;
        }
        return id != null && id.equals(((Vacina) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vacina{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", criada='" + getCriada() + "'" +
            "}";
    }
}
