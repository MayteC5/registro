package br.com.vacinacao.domain;

import br.com.vacinacao.domain.enumeration.Alergia;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Pessoa.
 */
@Entity
@Table(name = "pessoa")
public class Pessoa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "datanascimento")
    private LocalDate datanascimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "alergia")
    private Alergia alergia;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pessoa id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Pessoa nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDatanascimento() {
        return this.datanascimento;
    }

    public Pessoa datanascimento(LocalDate datanascimento) {
        this.datanascimento = datanascimento;
        return this;
    }

    public void setDatanascimento(LocalDate datanascimento) {
        this.datanascimento = datanascimento;
    }

    public Alergia getAlergia() {
        return this.alergia;
    }

    public Pessoa alergia(Alergia alergia) {
        this.alergia = alergia;
        return this;
    }

    public void setAlergia(Alergia alergia) {
        this.alergia = alergia;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pessoa)) {
            return false;
        }
        return id != null && id.equals(((Pessoa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pessoa{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", datanascimento='" + getDatanascimento() + "'" +
            ", alergia='" + getAlergia() + "'" +
            "}";
    }
}
