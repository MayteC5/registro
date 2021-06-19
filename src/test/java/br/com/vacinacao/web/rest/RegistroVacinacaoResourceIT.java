package br.com.vacinacao.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.vacinacao.IntegrationTest;
import br.com.vacinacao.domain.RegistroVacinacao;
import br.com.vacinacao.repository.RegistroVacinacaoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RegistroVacinacaoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RegistroVacinacaoResourceIT {

    private static final LocalDate DEFAULT_DIA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DIA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CNS = "AAAAAAAAAA";
    private static final String UPDATED_CNS = "BBBBBBBBBB";

    private static final String DEFAULT_ENFERMEIRO = "AAAAAAAAAA";
    private static final String UPDATED_ENFERMEIRO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/registro-vacinacaos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RegistroVacinacaoRepository registroVacinacaoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegistroVacinacaoMockMvc;

    private RegistroVacinacao registroVacinacao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroVacinacao createEntity(EntityManager em) {
        RegistroVacinacao registroVacinacao = new RegistroVacinacao().dia(DEFAULT_DIA).cns(DEFAULT_CNS).enfermeiro(DEFAULT_ENFERMEIRO);
        return registroVacinacao;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RegistroVacinacao createUpdatedEntity(EntityManager em) {
        RegistroVacinacao registroVacinacao = new RegistroVacinacao().dia(UPDATED_DIA).cns(UPDATED_CNS).enfermeiro(UPDATED_ENFERMEIRO);
        return registroVacinacao;
    }

    @BeforeEach
    public void initTest() {
        registroVacinacao = createEntity(em);
    }

    @Test
    @Transactional
    void createRegistroVacinacao() throws Exception {
        int databaseSizeBeforeCreate = registroVacinacaoRepository.findAll().size();
        // Create the RegistroVacinacao
        restRegistroVacinacaoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isCreated());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeCreate + 1);
        RegistroVacinacao testRegistroVacinacao = registroVacinacaoList.get(registroVacinacaoList.size() - 1);
        assertThat(testRegistroVacinacao.getDia()).isEqualTo(DEFAULT_DIA);
        assertThat(testRegistroVacinacao.getCns()).isEqualTo(DEFAULT_CNS);
        assertThat(testRegistroVacinacao.getEnfermeiro()).isEqualTo(DEFAULT_ENFERMEIRO);
    }

    @Test
    @Transactional
    void createRegistroVacinacaoWithExistingId() throws Exception {
        // Create the RegistroVacinacao with an existing ID
        registroVacinacao.setId(1L);

        int databaseSizeBeforeCreate = registroVacinacaoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegistroVacinacaoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRegistroVacinacaos() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        // Get all the registroVacinacaoList
        restRegistroVacinacaoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(registroVacinacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].dia").value(hasItem(DEFAULT_DIA.toString())))
            .andExpect(jsonPath("$.[*].cns").value(hasItem(DEFAULT_CNS)))
            .andExpect(jsonPath("$.[*].enfermeiro").value(hasItem(DEFAULT_ENFERMEIRO)));
    }

    @Test
    @Transactional
    void getRegistroVacinacao() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        // Get the registroVacinacao
        restRegistroVacinacaoMockMvc
            .perform(get(ENTITY_API_URL_ID, registroVacinacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(registroVacinacao.getId().intValue()))
            .andExpect(jsonPath("$.dia").value(DEFAULT_DIA.toString()))
            .andExpect(jsonPath("$.cns").value(DEFAULT_CNS))
            .andExpect(jsonPath("$.enfermeiro").value(DEFAULT_ENFERMEIRO));
    }

    @Test
    @Transactional
    void getNonExistingRegistroVacinacao() throws Exception {
        // Get the registroVacinacao
        restRegistroVacinacaoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRegistroVacinacao() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();

        // Update the registroVacinacao
        RegistroVacinacao updatedRegistroVacinacao = registroVacinacaoRepository.findById(registroVacinacao.getId()).get();
        // Disconnect from session so that the updates on updatedRegistroVacinacao are not directly saved in db
        em.detach(updatedRegistroVacinacao);
        updatedRegistroVacinacao.dia(UPDATED_DIA).cns(UPDATED_CNS).enfermeiro(UPDATED_ENFERMEIRO);

        restRegistroVacinacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegistroVacinacao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRegistroVacinacao))
            )
            .andExpect(status().isOk());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
        RegistroVacinacao testRegistroVacinacao = registroVacinacaoList.get(registroVacinacaoList.size() - 1);
        assertThat(testRegistroVacinacao.getDia()).isEqualTo(UPDATED_DIA);
        assertThat(testRegistroVacinacao.getCns()).isEqualTo(UPDATED_CNS);
        assertThat(testRegistroVacinacao.getEnfermeiro()).isEqualTo(UPDATED_ENFERMEIRO);
    }

    @Test
    @Transactional
    void putNonExistingRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, registroVacinacao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegistroVacinacaoWithPatch() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();

        // Update the registroVacinacao using partial update
        RegistroVacinacao partialUpdatedRegistroVacinacao = new RegistroVacinacao();
        partialUpdatedRegistroVacinacao.setId(registroVacinacao.getId());

        partialUpdatedRegistroVacinacao.dia(UPDATED_DIA).enfermeiro(UPDATED_ENFERMEIRO);

        restRegistroVacinacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroVacinacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroVacinacao))
            )
            .andExpect(status().isOk());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
        RegistroVacinacao testRegistroVacinacao = registroVacinacaoList.get(registroVacinacaoList.size() - 1);
        assertThat(testRegistroVacinacao.getDia()).isEqualTo(UPDATED_DIA);
        assertThat(testRegistroVacinacao.getCns()).isEqualTo(DEFAULT_CNS);
        assertThat(testRegistroVacinacao.getEnfermeiro()).isEqualTo(UPDATED_ENFERMEIRO);
    }

    @Test
    @Transactional
    void fullUpdateRegistroVacinacaoWithPatch() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();

        // Update the registroVacinacao using partial update
        RegistroVacinacao partialUpdatedRegistroVacinacao = new RegistroVacinacao();
        partialUpdatedRegistroVacinacao.setId(registroVacinacao.getId());

        partialUpdatedRegistroVacinacao.dia(UPDATED_DIA).cns(UPDATED_CNS).enfermeiro(UPDATED_ENFERMEIRO);

        restRegistroVacinacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegistroVacinacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegistroVacinacao))
            )
            .andExpect(status().isOk());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
        RegistroVacinacao testRegistroVacinacao = registroVacinacaoList.get(registroVacinacaoList.size() - 1);
        assertThat(testRegistroVacinacao.getDia()).isEqualTo(UPDATED_DIA);
        assertThat(testRegistroVacinacao.getCns()).isEqualTo(UPDATED_CNS);
        assertThat(testRegistroVacinacao.getEnfermeiro()).isEqualTo(UPDATED_ENFERMEIRO);
    }

    @Test
    @Transactional
    void patchNonExistingRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, registroVacinacao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isBadRequest());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegistroVacinacao() throws Exception {
        int databaseSizeBeforeUpdate = registroVacinacaoRepository.findAll().size();
        registroVacinacao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegistroVacinacaoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(registroVacinacao))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RegistroVacinacao in the database
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegistroVacinacao() throws Exception {
        // Initialize the database
        registroVacinacaoRepository.saveAndFlush(registroVacinacao);

        int databaseSizeBeforeDelete = registroVacinacaoRepository.findAll().size();

        // Delete the registroVacinacao
        restRegistroVacinacaoMockMvc
            .perform(delete(ENTITY_API_URL_ID, registroVacinacao.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RegistroVacinacao> registroVacinacaoList = registroVacinacaoRepository.findAll();
        assertThat(registroVacinacaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
