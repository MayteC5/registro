package br.com.vacinacao.web.rest;

import br.com.vacinacao.domain.Fabricante;
import br.com.vacinacao.repository.FabricanteRepository;
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
 * REST controller for managing {@link br.com.vacinacao.domain.Fabricante}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FabricanteResource {

    private final Logger log = LoggerFactory.getLogger(FabricanteResource.class);

    private static final String ENTITY_NAME = "fabricante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FabricanteRepository fabricanteRepository;

    public FabricanteResource(FabricanteRepository fabricanteRepository) {
        this.fabricanteRepository = fabricanteRepository;
    }

    /**
     * {@code POST  /fabricantes} : Create a new fabricante.
     *
     * @param fabricante the fabricante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fabricante, or with status {@code 400 (Bad Request)} if the fabricante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fabricantes")
    public ResponseEntity<Fabricante> createFabricante(@RequestBody Fabricante fabricante) throws URISyntaxException {
        log.debug("REST request to save Fabricante : {}", fabricante);
        if (fabricante.getId() != null) {
            throw new BadRequestAlertException("A new fabricante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fabricante result = fabricanteRepository.save(fabricante);
        return ResponseEntity
            .created(new URI("/api/fabricantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fabricantes/:id} : Updates an existing fabricante.
     *
     * @param id the id of the fabricante to save.
     * @param fabricante the fabricante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fabricante,
     * or with status {@code 400 (Bad Request)} if the fabricante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fabricante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fabricantes/{id}")
    public ResponseEntity<Fabricante> updateFabricante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fabricante fabricante
    ) throws URISyntaxException {
        log.debug("REST request to update Fabricante : {}, {}", id, fabricante);
        if (fabricante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fabricante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fabricanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fabricante result = fabricanteRepository.save(fabricante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fabricante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fabricantes/:id} : Partial updates given fields of an existing fabricante, field will ignore if it is null
     *
     * @param id the id of the fabricante to save.
     * @param fabricante the fabricante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fabricante,
     * or with status {@code 400 (Bad Request)} if the fabricante is not valid,
     * or with status {@code 404 (Not Found)} if the fabricante is not found,
     * or with status {@code 500 (Internal Server Error)} if the fabricante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fabricantes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Fabricante> partialUpdateFabricante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fabricante fabricante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fabricante partially : {}, {}", id, fabricante);
        if (fabricante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fabricante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fabricanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fabricante> result = fabricanteRepository
            .findById(fabricante.getId())
            .map(
                existingFabricante -> {
                    if (fabricante.getNome() != null) {
                        existingFabricante.setNome(fabricante.getNome());
                    }
                    if (fabricante.getCriado() != null) {
                        existingFabricante.setCriado(fabricante.getCriado());
                    }

                    return existingFabricante;
                }
            )
            .map(fabricanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fabricante.getId().toString())
        );
    }

    /**
     * {@code GET  /fabricantes} : get all the fabricantes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fabricantes in body.
     */
    @GetMapping("/fabricantes")
    public List<Fabricante> getAllFabricantes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Fabricantes");
        return fabricanteRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /fabricantes/:id} : get the "id" fabricante.
     *
     * @param id the id of the fabricante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fabricante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fabricantes/{id}")
    public ResponseEntity<Fabricante> getFabricante(@PathVariable Long id) {
        log.debug("REST request to get Fabricante : {}", id);
        Optional<Fabricante> fabricante = fabricanteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(fabricante);
    }

    /**
     * {@code DELETE  /fabricantes/:id} : delete the "id" fabricante.
     *
     * @param id the id of the fabricante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fabricantes/{id}")
    public ResponseEntity<Void> deleteFabricante(@PathVariable Long id) {
        log.debug("REST request to delete Fabricante : {}", id);
        fabricanteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
