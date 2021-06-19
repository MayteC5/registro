import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FabricanteService } from '../service/fabricante.service';

import { FabricanteComponent } from './fabricante.component';

describe('Component Tests', () => {
  describe('Fabricante Management Component', () => {
    let comp: FabricanteComponent;
    let fixture: ComponentFixture<FabricanteComponent>;
    let service: FabricanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FabricanteComponent],
      })
        .overrideTemplate(FabricanteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FabricanteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FabricanteService);

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
      expect(comp.fabricantes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
