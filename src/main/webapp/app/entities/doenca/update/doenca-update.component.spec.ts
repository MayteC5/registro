jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DoencaService } from '../service/doenca.service';
import { IDoenca, Doenca } from '../doenca.model';

import { DoencaUpdateComponent } from './doenca-update.component';

describe('Component Tests', () => {
  describe('Doenca Management Update Component', () => {
    let comp: DoencaUpdateComponent;
    let fixture: ComponentFixture<DoencaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let doencaService: DoencaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DoencaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DoencaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DoencaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      doencaService = TestBed.inject(DoencaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const doenca: IDoenca = { id: 456 };

        activatedRoute.data = of({ doenca });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(doenca));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const doenca = { id: 123 };
        spyOn(doencaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ doenca });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: doenca }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(doencaService.update).toHaveBeenCalledWith(doenca);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const doenca = new Doenca();
        spyOn(doencaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ doenca });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: doenca }));
        saveSubject.complete();

        // THEN
        expect(doencaService.create).toHaveBeenCalledWith(doenca);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const doenca = { id: 123 };
        spyOn(doencaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ doenca });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(doencaService.update).toHaveBeenCalledWith(doenca);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
