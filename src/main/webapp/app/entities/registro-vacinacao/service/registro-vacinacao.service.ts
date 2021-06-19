import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistroVacinacao, getRegistroVacinacaoIdentifier } from '../registro-vacinacao.model';

export type EntityResponseType = HttpResponse<IRegistroVacinacao>;
export type EntityArrayResponseType = HttpResponse<IRegistroVacinacao[]>;

@Injectable({ providedIn: 'root' })
export class RegistroVacinacaoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/registro-vacinacaos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(registroVacinacao: IRegistroVacinacao): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroVacinacao);
    return this.http
      .post<IRegistroVacinacao>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(registroVacinacao: IRegistroVacinacao): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroVacinacao);
    return this.http
      .put<IRegistroVacinacao>(`${this.resourceUrl}/${getRegistroVacinacaoIdentifier(registroVacinacao) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(registroVacinacao: IRegistroVacinacao): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroVacinacao);
    return this.http
      .patch<IRegistroVacinacao>(`${this.resourceUrl}/${getRegistroVacinacaoIdentifier(registroVacinacao) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRegistroVacinacao>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRegistroVacinacao[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegistroVacinacaoToCollectionIfMissing(
    registroVacinacaoCollection: IRegistroVacinacao[],
    ...registroVacinacaosToCheck: (IRegistroVacinacao | null | undefined)[]
  ): IRegistroVacinacao[] {
    const registroVacinacaos: IRegistroVacinacao[] = registroVacinacaosToCheck.filter(isPresent);
    if (registroVacinacaos.length > 0) {
      const registroVacinacaoCollectionIdentifiers = registroVacinacaoCollection.map(
        registroVacinacaoItem => getRegistroVacinacaoIdentifier(registroVacinacaoItem)!
      );
      const registroVacinacaosToAdd = registroVacinacaos.filter(registroVacinacaoItem => {
        const registroVacinacaoIdentifier = getRegistroVacinacaoIdentifier(registroVacinacaoItem);
        if (registroVacinacaoIdentifier == null || registroVacinacaoCollectionIdentifiers.includes(registroVacinacaoIdentifier)) {
          return false;
        }
        registroVacinacaoCollectionIdentifiers.push(registroVacinacaoIdentifier);
        return true;
      });
      return [...registroVacinacaosToAdd, ...registroVacinacaoCollection];
    }
    return registroVacinacaoCollection;
  }

  protected convertDateFromClient(registroVacinacao: IRegistroVacinacao): IRegistroVacinacao {
    return Object.assign({}, registroVacinacao, {
      dia: registroVacinacao.dia?.isValid() ? registroVacinacao.dia.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dia = res.body.dia ? dayjs(res.body.dia) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((registroVacinacao: IRegistroVacinacao) => {
        registroVacinacao.dia = registroVacinacao.dia ? dayjs(registroVacinacao.dia) : undefined;
      });
    }
    return res;
  }
}
