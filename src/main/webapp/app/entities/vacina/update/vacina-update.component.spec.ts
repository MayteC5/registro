jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VacinaService } from '../service/vacina.service';
import { IVacina, Vacina } from '../vacina.model';
import { IDoenca } from 'app/entities/doenca/doenca.model';
import { DoencaService } from 'app/entities/doenca/service/doenca.service';

import { VacinaUpdateComponent } from './vacina-update.component';

describe('Component Tests', () => {
  describe('Vacina Management Update Component', () => {
    let comp: VacinaUpdateComponent;
    let fixture: ComponentFixture<VacinaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vacinaService: VacinaService;
    let doencaService: DoencaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VacinaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VacinaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VacinaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vacinaService = TestBed.inject(VacinaService);
      doencaService = TestBed.inject(DoencaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Doenca query and add missing value', () => {
        const vacina: IVacina = { id: 456 };
        const doenca: IDoenca = { id: 66403 };
        vacina.doenca = doenca;

        const doencaCollection: IDoenca[] = [{ id: 77076 }];
        spyOn(doencaService, 'query').and.returnValue(of(new HttpResponse({ body: doencaCollection })));
        const additionalDoencas = [doenca];
        const expectedCollection: IDoenca[] = [...additionalDoencas, ...doencaCollection];
        spyOn(doencaService, 'addDoencaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ vacina });
        comp.ngOnInit();

        expect(doencaService.query).toHaveBeenCalled();
        expect(doencaService.addDoencaToCollectionIfMissing).toHaveBeenCalledWith(doencaCollection, ...additionalDoencas);
        expect(comp.doencasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vacina: IVacina = { id: 456 };
        const doenca: IDoenca = { id: 37787 };
        vacina.doenca = doenca;

        activatedRoute.data = of({ vacina });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vacina));
        expect(comp.doencasSharedCollection).toContain(doenca);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vacina = { id: 123 };
        spyOn(vacinaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vacina });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vacina }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vacinaService.update).toHaveBeenCalledWith(vacina);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vacina = new Vacina();
        spyOn(vacinaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vacina });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vacina }));
        saveSubject.complete();

        // THEN
        expect(vacinaService.create).toHaveBeenCalledWith(vacina);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vacina = { id: 123 };
        spyOn(vacinaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vacina });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vacinaService.update).toHaveBeenCalledWith(vacina);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDoencaById', () => {
        it('Should return tracked Doenca primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDoencaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
