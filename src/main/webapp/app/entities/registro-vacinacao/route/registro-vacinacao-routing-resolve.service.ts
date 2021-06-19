import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistroVacinacao, RegistroVacinacao } from '../registro-vacinacao.model';
import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';

@Injectable({ providedIn: 'root' })
export class RegistroVacinacaoRoutingResolveService implements Resolve<IRegistroVacinacao> {
  constructor(protected service: RegistroVacinacaoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegistroVacinacao> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((registroVacinacao: HttpResponse<RegistroVacinacao>) => {
          if (registroVacinacao.body) {
            return of(registroVacinacao.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RegistroVacinacao());
  }
}
