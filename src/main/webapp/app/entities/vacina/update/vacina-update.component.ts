import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVacina, Vacina } from '../vacina.model';
import { VacinaService } from '../service/vacina.service';
import { IDoenca } from 'app/entities/doenca/doenca.model';
import { DoencaService } from 'app/entities/doenca/service/doenca.service';

@Component({
  selector: 'jhi-vacina-update',
  templateUrl: './vacina-update.component.html',
})
export class VacinaUpdateComponent implements OnInit {
  isSaving = false;

  doencasSharedCollection: IDoenca[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    criada: [],
    doenca: [],
  });

  constructor(
    protected vacinaService: VacinaService,
    protected doencaService: DoencaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacina }) => {
      if (vacina.id === undefined) {
        const today = dayjs().startOf('day');
        vacina.criada = today;
      }

      this.updateForm(vacina);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vacina = this.createFromForm();
    if (vacina.id !== undefined) {
      this.subscribeToSaveResponse(this.vacinaService.update(vacina));
    } else {
      this.subscribeToSaveResponse(this.vacinaService.create(vacina));
    }
  }

  trackDoencaById(index: number, item: IDoenca): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacina>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vacina: IVacina): void {
    this.editForm.patchValue({
      id: vacina.id,
      nome: vacina.nome,
      criada: vacina.criada ? vacina.criada.format(DATE_TIME_FORMAT) : null,
      doenca: vacina.doenca,
    });

    this.doencasSharedCollection = this.doencaService.addDoencaToCollectionIfMissing(this.doencasSharedCollection, vacina.doenca);
  }

  protected loadRelationshipsOptions(): void {
    this.doencaService
      .query()
      .pipe(map((res: HttpResponse<IDoenca[]>) => res.body ?? []))
      .pipe(map((doencas: IDoenca[]) => this.doencaService.addDoencaToCollectionIfMissing(doencas, this.editForm.get('doenca')!.value)))
      .subscribe((doencas: IDoenca[]) => (this.doencasSharedCollection = doencas));
  }

  protected createFromForm(): IVacina {
    return {
      ...new Vacina(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      criada: this.editForm.get(['criada'])!.value ? dayjs(this.editForm.get(['criada'])!.value, DATE_TIME_FORMAT) : undefined,
      doenca: this.editForm.get(['doenca'])!.value,
    };
  }
}
