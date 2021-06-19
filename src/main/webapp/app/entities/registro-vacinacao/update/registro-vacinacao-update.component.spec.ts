jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';
import { IRegistroVacinacao, RegistroVacinacao } from '../registro-vacinacao.model';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';
import { FabricanteService } from 'app/entities/fabricante/service/fabricante.service';

import { RegistroVacinacaoUpdateComponent } from './registro-vacinacao-update.component';

describe('Component Tests', () => {
  describe('RegistroVacinacao Management Update Component', () => {
    let comp: RegistroVacinacaoUpdateComponent;
    let fixture: ComponentFixture<RegistroVacinacaoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let registroVacinacaoService: RegistroVacinacaoService;
    let pessoaService: PessoaService;
    let vacinaService: VacinaService;
    let fabricanteService: FabricanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RegistroVacinacaoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RegistroVacinacaoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegistroVacinacaoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      registroVacinacaoService = TestBed.inject(RegistroVacinacaoService);
      pessoaService = TestBed.inject(PessoaService);
      vacinaService = TestBed.inject(VacinaService);
      fabricanteService = TestBed.inject(FabricanteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pessoa query and add missing value', () => {
        const registroVacinacao: IRegistroVacinacao = { id: 456 };
        const pessoa: IPessoa = { id: 45267 };
        registroVacinacao.pessoa = pessoa;

        const pessoaCollection: IPessoa[] = [{ id: 37261 }];
        spyOn(pessoaService, 'query').and.returnValue(of(new HttpResponse({ body: pessoaCollection })));
        const additionalPessoas = [pessoa];
        const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
        spyOn(pessoaService, 'addPessoaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        expect(pessoaService.query).toHaveBeenCalled();
        expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(pessoaCollection, ...additionalPessoas);
        expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Vacina query and add missing value', () => {
        const registroVacinacao: IRegistroVacinacao = { id: 456 };
        const vacina: IVacina = { id: 4927 };
        registroVacinacao.vacina = vacina;

        const vacinaCollection: IVacina[] = [{ id: 84315 }];
        spyOn(vacinaService, 'query').and.returnValue(of(new HttpResponse({ body: vacinaCollection })));
        const additionalVacinas = [vacina];
        const expectedCollection: IVacina[] = [...additionalVacinas, ...vacinaCollection];
        spyOn(vacinaService, 'addVacinaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        expect(vacinaService.query).toHaveBeenCalled();
        expect(vacinaService.addVacinaToCollectionIfMissing).toHaveBeenCalledWith(vacinaCollection, ...additionalVacinas);
        expect(comp.vacinasSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Fabricante query and add missing value', () => {
        const registroVacinacao: IRegistroVacinacao = { id: 456 };
        const fabricante: IFabricante = { id: 29299 };
        registroVacinacao.fabricante = fabricante;

        const fabricanteCollection: IFabricante[] = [{ id: 20507 }];
        spyOn(fabricanteService, 'query').and.returnValue(of(new HttpResponse({ body: fabricanteCollection })));
        const additionalFabricantes = [fabricante];
        const expectedCollection: IFabricante[] = [...additionalFabricantes, ...fabricanteCollection];
        spyOn(fabricanteService, 'addFabricanteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        expect(fabricanteService.query).toHaveBeenCalled();
        expect(fabricanteService.addFabricanteToCollectionIfMissing).toHaveBeenCalledWith(fabricanteCollection, ...additionalFabricantes);
        expect(comp.fabricantesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const registroVacinacao: IRegistroVacinacao = { id: 456 };
        const pessoa: IPessoa = { id: 21338 };
        registroVacinacao.pessoa = pessoa;
        const vacina: IVacina = { id: 60952 };
        registroVacinacao.vacina = vacina;
        const fabricante: IFabricante = { id: 52532 };
        registroVacinacao.fabricante = fabricante;

        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(registroVacinacao));
        expect(comp.pessoasSharedCollection).toContain(pessoa);
        expect(comp.vacinasSharedCollection).toContain(vacina);
        expect(comp.fabricantesSharedCollection).toContain(fabricante);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const registroVacinacao = { id: 123 };
        spyOn(registroVacinacaoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: registroVacinacao }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(registroVacinacaoService.update).toHaveBeenCalledWith(registroVacinacao);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const registroVacinacao = new RegistroVacinacao();
        spyOn(registroVacinacaoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: registroVacinacao }));
        saveSubject.complete();

        // THEN
        expect(registroVacinacaoService.create).toHaveBeenCalledWith(registroVacinacao);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const registroVacinacao = { id: 123 };
        spyOn(registroVacinacaoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ registroVacinacao });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(registroVacinacaoService.update).toHaveBeenCalledWith(registroVacinacao);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPessoaById', () => {
        it('Should return tracked Pessoa primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPessoaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackVacinaById', () => {
        it('Should return tracked Vacina primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVacinaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackFabricanteById', () => {
        it('Should return tracked Fabricante primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFabricanteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
