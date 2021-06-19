import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegistroVacinacaoDetailComponent } from './registro-vacinacao-detail.component';

describe('Component Tests', () => {
  describe('RegistroVacinacao Management Detail Component', () => {
    let comp: RegistroVacinacaoDetailComponent;
    let fixture: ComponentFixture<RegistroVacinacaoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RegistroVacinacaoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ registroVacinacao: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RegistroVacinacaoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RegistroVacinacaoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load registroVacinacao on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.registroVacinacao).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
