package br.com.vacinacao.web.rest;

import br.com.vacinacao.domain.RegistroVacinacao;
import br.com.vacinacao.repository.RegistroVacinacaoRepository;
import br.com.vacinacao.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.vacinacao.domain.RegistroVacinacao}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RegistroVacinacaoResource {

    private final Logger log = LoggerFactory.getLogger(RegistroVacinacaoResource.class);

    private static final String ENTITY_NAME = "registroVacinacao";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistroVacinacaoRepository registroVacinacaoRepository;

    public RegistroVacinacaoResource(RegistroVacinacaoRepository registroVacinacaoRepository) {
        this.registroVacinacaoRepository = registroVacinacaoRepository;
    }

    /**
     * {@code POST  /registro-vacinacaos} : Create a new registroVacinacao.
     *
     * @param registroVacinacao the registroVacinacao to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registroVacinacao, or with status {@code 400 (Bad Request)} if the registroVacinacao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/registro-vacinacaos")
    public ResponseEntity<RegistroVacinacao> createRegistroVacinacao(@RequestBody RegistroVacinacao registroVacinacao)
        throws URISyntaxException {
        log.debug("REST request to save RegistroVacinacao : {}", registroVacinacao);
        if (registroVacinacao.getId() != null) {
            throw new BadRequestAlertException("A new registroVacinacao cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RegistroVacinacao result = registroVacinacaoRepository.save(registroVacinacao);
        return ResponseEntity
            .created(new URI("/api/registro-vacinacaos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /registro-vacinacaos/:id} : Updates an existing registroVacinacao.
     *
     * @param id the id of the registroVacinacao to save.
     * @param registroVacinacao the registroVacinacao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroVacinacao,
     * or with status {@code 400 (Bad Request)} if the registroVacinacao is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registroVacinacao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/registro-vacinacaos/{id}")
    public ResponseEntity<RegistroVacinacao> updateRegistroVacinacao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RegistroVacinacao registroVacinacao
    ) throws URISyntaxException {
        log.debug("REST request to update RegistroVacinacao : {}, {}", id, registroVacinacao);
        if (registroVacinacao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroVacinacao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroVacinacaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RegistroVacinacao result = registroVacinacaoRepository.save(registroVacinacao);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, registroVacinacao.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /registro-vacinacaos/:id} : Partial updates given fields of an existing registroVacinacao, field will ignore if it is null
     *
     * @param id the id of the registroVacinacao to save.
     * @param registroVacinacao the registroVacinacao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroVacinacao,
     * or with status {@code 400 (Bad Request)} if the registroVacinacao is not valid,
     * or with status {@code 404 (Not Found)} if the registroVacinacao is not found,
     * or with status {@code 500 (Internal Server Error)} if the registroVacinacao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/registro-vacinacaos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<RegistroVacinacao> partialUpdateRegistroVacinacao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RegistroVacinacao registroVacinacao
    ) throws URISyntaxException {
        log.debug("REST request to partial update RegistroVacinacao partially : {}, {}", id, registroVacinacao);
        if (registroVacinacao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroVacinacao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroVacinacaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RegistroVacinacao> result = registroVacinacaoRepository
            .findById(registroVacinacao.getId())
            .map(
                existingRegistroVacinacao -> {
                    if (registroVacinacao.getDia() != null) {
                        existingRegistroVacinacao.setDia(registroVacinacao.getDia());
                    }
                    if (registroVacinacao.getCns() != null) {
                        existingRegistroVacinacao.setCns(registroVacinacao.getCns());
                    }
                    if (registroVacinacao.getEnfermeiro() != null) {
                        existingRegistroVacinacao.setEnfermeiro(registroVacinacao.getEnfermeiro());
                    }

                    return existingRegistroVacinacao;
                }
            )
            .map(registroVacinacaoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, registroVacinacao.getId().toString())
        );
    }

    /**
     * {@code GET  /registro-vacinacaos} : get all the registroVacinacaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registroVacinacaos in body.
     */
    @GetMapping("/registro-vacinacaos")
    public List<RegistroVacinacao> getAllRegistroVacinacaos() {
        log.debug("REST request to get all RegistroVacinacaos");
        return registroVacinacaoRepository.findAll();
    }

    /**
     * {@code GET  /registro-vacinacaos/:id} : get the "id" registroVacinacao.
     *
     * @param id the id of the registroVacinacao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registroVacinacao, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/registro-vacinacaos/{id}")
    public ResponseEntity<RegistroVacinacao> getRegistroVacinacao(@PathVariable Long id) {
        log.debug("REST request to get RegistroVacinacao : {}", id);
        Optional<RegistroVacinacao> registroVacinacao = registroVacinacaoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(registroVacinacao);
    }

    /**
     * {@code DELETE  /registro-vacinacaos/:id} : delete the "id" registroVacinacao.
     *
     * @param id the id of the registroVacinacao to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/registro-vacinacaos/{id}")
    public ResponseEntity<Void> deleteRegistroVacinacao(@PathVariable Long id) {
        log.debug("REST request to delete RegistroVacinacao : {}", id);
        registroVacinacaoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
