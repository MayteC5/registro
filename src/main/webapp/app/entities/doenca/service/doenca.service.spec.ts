import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDoenca, Doenca } from '../doenca.model';

import { DoencaService } from './doenca.service';

describe('Service Tests', () => {
  describe('Doenca Service', () => {
    let service: DoencaService;
    let httpMock: HttpTestingController;
    let elemDefault: IDoenca;
    let expectedResult: IDoenca | IDoenca[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DoencaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        primeirocaso: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            primeirocaso: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Doenca', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            primeirocaso: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            primeirocaso: currentDate,
          },
          returnedFromService
        );

        service.create(new Doenca()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Doenca', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            primeirocaso: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            primeirocaso: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Doenca', () => {
        const patchObject = Object.assign({}, new Doenca());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            primeirocaso: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Doenca', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            primeirocaso: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            primeirocaso: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Doenca', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDoencaToCollectionIfMissing', () => {
        it('should add a Doenca to an empty array', () => {
          const doenca: IDoenca = { id: 123 };
          expectedResult = service.addDoencaToCollectionIfMissing([], doenca);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(doenca);
        });

        it('should not add a Doenca to an array that contains it', () => {
          const doenca: IDoenca = { id: 123 };
          const doencaCollection: IDoenca[] = [
            {
              ...doenca,
            },
            { id: 456 },
          ];
          expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, doenca);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Doenca to an array that doesn't contain it", () => {
          const doenca: IDoenca = { id: 123 };
          const doencaCollection: IDoenca[] = [{ id: 456 }];
          expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, doenca);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(doenca);
        });

        it('should add only unique Doenca to an array', () => {
          const doencaArray: IDoenca[] = [{ id: 123 }, { id: 456 }, { id: 2718 }];
          const doencaCollection: IDoenca[] = [{ id: 123 }];
          expectedResult = service.addDoencaToCollectionIfMissing(doencaCollection, ...doencaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const doenca: IDoenca = { id: 123 };
          const doenca2: IDoenca = { id: 456 };
          expectedResult = service.addDoencaToCollectionIfMissing([], doenca, doenca2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(doenca);
          expect(expectedResult).toContain(doenca2);
        });

        it('should accept null and undefined values', () => {
          const doenca: IDoenca = { id: 123 };
          expectedResult = service.addDoencaToCollectionIfMissing([], null, doenca, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(doenca);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
