import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DoencaService } from '../service/doenca.service';

import { DoencaComponent } from './doenca.component';

describe('Component Tests', () => {
  describe('Doenca Management Component', () => {
    let comp: DoencaComponent;
    let fixture: ComponentFixture<DoencaComponent>;
    let service: DoencaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DoencaComponent],
      })
        .overrideTemplate(DoencaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DoencaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DoencaService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.doencas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
