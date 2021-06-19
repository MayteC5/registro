import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';

import { RegistroVacinacaoComponent } from './registro-vacinacao.component';

describe('Component Tests', () => {
  describe('RegistroVacinacao Management Component', () => {
    let comp: RegistroVacinacaoComponent;
    let fixture: ComponentFixture<RegistroVacinacaoComponent>;
    let service: RegistroVacinacaoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RegistroVacinacaoComponent],
      })
        .overrideTemplate(RegistroVacinacaoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RegistroVacinacaoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RegistroVacinacaoService);

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
      expect(comp.registroVacinacaos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
