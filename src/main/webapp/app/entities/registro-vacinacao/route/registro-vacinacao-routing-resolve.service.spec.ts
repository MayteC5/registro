jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRegistroVacinacao, RegistroVacinacao } from '../registro-vacinacao.model';
import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';

import { RegistroVacinacaoRoutingResolveService } from './registro-vacinacao-routing-resolve.service';

describe('Service Tests', () => {
  describe('RegistroVacinacao routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RegistroVacinacaoRoutingResolveService;
    let service: RegistroVacinacaoService;
    let resultRegistroVacinacao: IRegistroVacinacao | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RegistroVacinacaoRoutingResolveService);
      service = TestBed.inject(RegistroVacinacaoService);
      resultRegistroVacinacao = undefined;
    });

    describe('resolve', () => {
      it('should return IRegistroVacinacao returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegistroVacinacao = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRegistroVacinacao).toEqual({ id: 123 });
      });

      it('should return new IRegistroVacinacao if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegistroVacinacao = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRegistroVacinacao).toEqual(new RegistroVacinacao());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRegistroVacinacao = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRegistroVacinacao).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
