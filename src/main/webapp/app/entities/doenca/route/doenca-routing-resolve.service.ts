import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDoenca, Doenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';

@Injectable({ providedIn: 'root' })
export class DoencaRoutingResolveService implements Resolve<IDoenca> {
  constructor(protected service: DoencaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDoenca> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((doenca: HttpResponse<Doenca>) => {
          if (doenca.body) {
            return of(doenca.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Doenca());
  }
}
