jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VacinaService } from '../service/vacina.service';

import { VacinaDeleteDialogComponent } from './vacina-delete-dialog.component';

describe('Component Tests', () => {
  describe('Vacina Management Delete Component', () => {
    let comp: VacinaDeleteDialogComponent;
    let fixture: ComponentFixture<VacinaDeleteDialogComponent>;
    let service: VacinaService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VacinaDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(VacinaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VacinaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VacinaService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
