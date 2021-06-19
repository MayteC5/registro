package br.com.vacinacao.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.vacinacao.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DoencaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Doenca.class);
        Doenca doenca1 = new Doenca();
        doenca1.setId(1L);
        Doenca doenca2 = new Doenca();
        doenca2.setId(doenca1.getId());
        assertThat(doenca1).isEqualTo(doenca2);
        doenca2.setId(2L);
        assertThat(doenca1).isNotEqualTo(doenca2);
        doenca1.setId(null);
        assertThat(doenca1).isNotEqualTo(doenca2);
    }
}
