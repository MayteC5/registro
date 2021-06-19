import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDoenca, getDoencaIdentifier } from '../doenca.model';

export type EntityResponseType = HttpResponse<IDoenca>;
export type EntityArrayResponseType = HttpResponse<IDoenca[]>;

@Injectable({ providedIn: 'root' })
export class DoencaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/doencas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(doenca: IDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .post<IDoenca>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(doenca: IDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .put<IDoenca>(`${this.resourceUrl}/${getDoencaIdentifier(doenca) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(doenca: IDoenca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(doenca);
    return this.http
      .patch<IDoenca>(`${this.resourceUrl}/${getDoencaIdentifier(doenca) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDoenca>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDoenca[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDoencaToCollectionIfMissing(doencaCollection: IDoenca[], ...doencasToCheck: (IDoenca | null | undefined)[]): IDoenca[] {
    const doencas: IDoenca[] = doencasToCheck.filter(isPresent);
    if (doencas.length > 0) {
      const doencaCollectionIdentifiers = doencaCollection.map(doencaItem => getDoencaIdentifier(doencaItem)!);
      const doencasToAdd = doencas.filter(doencaItem => {
        const doencaIdentifier = getDoencaIdentifier(doencaItem);
        if (doencaIdentifier == null || doencaCollectionIdentifiers.includes(doencaIdentifier)) {
          return false;
        }
        doencaCollectionIdentifiers.push(doencaIdentifier);
        return true;
      });
      return [...doencasToAdd, ...doencaCollection];
    }
    return doencaCollection;
  }

  protected convertDateFromClient(doenca: IDoenca): IDoenca {
    return Object.assign({}, doenca, {
      primeirocaso: doenca.primeirocaso?.isValid() ? doenca.primeirocaso.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.primeirocaso = res.body.primeirocaso ? dayjs(res.body.primeirocaso) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((doenca: IDoenca) => {
        doenca.primeirocaso = doenca.primeirocaso ? dayjs(doenca.primeirocaso) : undefined;
      });
    }
    return res;
  }
}
