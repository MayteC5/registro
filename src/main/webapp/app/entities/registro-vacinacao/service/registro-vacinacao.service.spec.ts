import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRegistroVacinacao, RegistroVacinacao } from '../registro-vacinacao.model';

import { RegistroVacinacaoService } from './registro-vacinacao.service';

describe('Service Tests', () => {
  describe('RegistroVacinacao Service', () => {
    let service: RegistroVacinacaoService;
    let httpMock: HttpTestingController;
    let elemDefault: IRegistroVacinacao;
    let expectedResult: IRegistroVacinacao | IRegistroVacinacao[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RegistroVacinacaoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dia: currentDate,
        cns: 'AAAAAAA',
        enfermeiro: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dia: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a RegistroVacinacao', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dia: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dia: currentDate,
          },
          returnedFromService
        );

        service.create(new RegistroVacinacao()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RegistroVacinacao', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dia: currentDate.format(DATE_FORMAT),
            cns: 'BBBBBB',
            enfermeiro: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dia: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RegistroVacinacao', () => {
        const patchObject = Object.assign(
          {
            dia: currentDate.format(DATE_FORMAT),
            enfermeiro: 'BBBBBB',
          },
          new RegistroVacinacao()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dia: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RegistroVacinacao', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dia: currentDate.format(DATE_FORMAT),
            cns: 'BBBBBB',
            enfermeiro: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dia: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a RegistroVacinacao', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRegistroVacinacaoToCollectionIfMissing', () => {
        it('should add a RegistroVacinacao to an empty array', () => {
          const registroVacinacao: IRegistroVacinacao = { id: 123 };
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing([], registroVacinacao);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(registroVacinacao);
        });

        it('should not add a RegistroVacinacao to an array that contains it', () => {
          const registroVacinacao: IRegistroVacinacao = { id: 123 };
          const registroVacinacaoCollection: IRegistroVacinacao[] = [
            {
              ...registroVacinacao,
            },
            { id: 456 },
          ];
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing(registroVacinacaoCollection, registroVacinacao);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RegistroVacinacao to an array that doesn't contain it", () => {
          const registroVacinacao: IRegistroVacinacao = { id: 123 };
          const registroVacinacaoCollection: IRegistroVacinacao[] = [{ id: 456 }];
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing(registroVacinacaoCollection, registroVacinacao);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(registroVacinacao);
        });

        it('should add only unique RegistroVacinacao to an array', () => {
          const registroVacinacaoArray: IRegistroVacinacao[] = [{ id: 123 }, { id: 456 }, { id: 11241 }];
          const registroVacinacaoCollection: IRegistroVacinacao[] = [{ id: 123 }];
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing(registroVacinacaoCollection, ...registroVacinacaoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const registroVacinacao: IRegistroVacinacao = { id: 123 };
          const registroVacinacao2: IRegistroVacinacao = { id: 456 };
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing([], registroVacinacao, registroVacinacao2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(registroVacinacao);
          expect(expectedResult).toContain(registroVacinacao2);
        });

        it('should accept null and undefined values', () => {
          const registroVacinacao: IRegistroVacinacao = { id: 123 };
          expectedResult = service.addRegistroVacinacaoToCollectionIfMissing([], null, registroVacinacao, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(registroVacinacao);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
