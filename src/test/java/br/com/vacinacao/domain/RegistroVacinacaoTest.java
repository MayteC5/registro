package br.com.vacinacao.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.vacinacao.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RegistroVacinacaoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegistroVacinacao.class);
        RegistroVacinacao registroVacinacao1 = new RegistroVacinacao();
        registroVacinacao1.setId(1L);
        RegistroVacinacao registroVacinacao2 = new RegistroVacinacao();
        registroVacinacao2.setId(registroVacinacao1.getId());
        assertThat(registroVacinacao1).isEqualTo(registroVacinacao2);
        registroVacinacao2.setId(2L);
        assertThat(registroVacinacao1).isNotEqualTo(registroVacinacao2);
        registroVacinacao1.setId(null);
        assertThat(registroVacinacao1).isNotEqualTo(registroVacinacao2);
    }
}
