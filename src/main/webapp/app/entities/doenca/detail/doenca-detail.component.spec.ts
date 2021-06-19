import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoencaDetailComponent } from './doenca-detail.component';

describe('Component Tests', () => {
  describe('Doenca Management Detail Component', () => {
    let comp: DoencaDetailComponent;
    let fixture: ComponentFixture<DoencaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DoencaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ doenca: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DoencaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DoencaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load doenca on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.doenca).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
