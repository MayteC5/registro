jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FabricanteService } from '../service/fabricante.service';
import { IFabricante, Fabricante } from '../fabricante.model';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';

import { FabricanteUpdateComponent } from './fabricante-update.component';

describe('Component Tests', () => {
  describe('Fabricante Management Update Component', () => {
    let comp: FabricanteUpdateComponent;
    let fixture: ComponentFixture<FabricanteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fabricanteService: FabricanteService;
    let vacinaService: VacinaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FabricanteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FabricanteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FabricanteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fabricanteService = TestBed.inject(FabricanteService);
      vacinaService = TestBed.inject(VacinaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vacina query and add missing value', () => {
        const fabricante: IFabricante = { id: 456 };
        const vacinas: IVacina[] = [{ id: 20343 }];
        fabricante.vacinas = vacinas;

        const vacinaCollection: IVacina[] = [{ id: 3824 }];
        spyOn(vacinaService, 'query').and.returnValue(of(new HttpResponse({ body: vacinaCollection })));
        const additionalVacinas = [...vacinas];
        const expectedCollection: IVacina[] = [...additionalVacinas, ...vacinaCollection];
        spyOn(vacinaService, 'addVacinaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fabricante });
        comp.ngOnInit();

        expect(vacinaService.query).toHaveBeenCalled();
        expect(vacinaService.addVacinaToCollectionIfMissing).toHaveBeenCalledWith(vacinaCollection, ...additionalVacinas);
        expect(comp.vacinasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fabricante: IFabricante = { id: 456 };
        const vacinas: IVacina = { id: 30053 };
        fabricante.vacinas = [vacinas];

        activatedRoute.data = of({ fabricante });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fabricante));
        expect(comp.vacinasSharedCollection).toContain(vacinas);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fabricante = { id: 123 };
        spyOn(fabricanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fabricante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fabricante }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fabricanteService.update).toHaveBeenCalledWith(fabricante);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fabricante = new Fabricante();
        spyOn(fabricanteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fabricante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fabricante }));
        saveSubject.complete();

        // THEN
        expect(fabricanteService.create).toHaveBeenCalledWith(fabricante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fabricante = { id: 123 };
        spyOn(fabricanteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fabricante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fabricanteService.update).toHaveBeenCalledWith(fabricante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVacinaById', () => {
        it('Should return tracked Vacina primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVacinaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedVacina', () => {
        it('Should return option if no Vacina is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedVacina(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Vacina for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedVacina(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Vacina is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedVacina(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
