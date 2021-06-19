package br.com.vacinacao.repository;

import br.com.vacinacao.domain.RegistroVacinacao;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RegistroVacinacao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegistroVacinacaoRepository extends JpaRepository<RegistroVacinacao, Long> {}
