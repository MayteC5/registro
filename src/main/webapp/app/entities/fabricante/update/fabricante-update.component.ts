import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFabricante, Fabricante } from '../fabricante.model';
import { FabricanteService } from '../service/fabricante.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';

@Component({
  selector: 'jhi-fabricante-update',
  templateUrl: './fabricante-update.component.html',
})
export class FabricanteUpdateComponent implements OnInit {
  isSaving = false;

  vacinasSharedCollection: IVacina[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    criado: [],
    vacinas: [],
  });

  constructor(
    protected fabricanteService: FabricanteService,
    protected vacinaService: VacinaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fabricante }) => {
      if (fabricante.id === undefined) {
        const today = dayjs().startOf('day');
        fabricante.criado = today;
      }

      this.updateForm(fabricante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fabricante = this.createFromForm();
    if (fabricante.id !== undefined) {
      this.subscribeToSaveResponse(this.fabricanteService.update(fabricante));
    } else {
      this.subscribeToSaveResponse(this.fabricanteService.create(fabricante));
    }
  }

  trackVacinaById(index: number, item: IVacina): number {
    return item.id!;
  }

  getSelectedVacina(option: IVacina, selectedVals?: IVacina[]): IVacina {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFabricante>>): void {
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

  protected updateForm(fabricante: IFabricante): void {
    this.editForm.patchValue({
      id: fabricante.id,
      nome: fabricante.nome,
      criado: fabricante.criado ? fabricante.criado.format(DATE_TIME_FORMAT) : null,
      vacinas: fabricante.vacinas,
    });

    this.vacinasSharedCollection = this.vacinaService.addVacinaToCollectionIfMissing(
      this.vacinasSharedCollection,
      ...(fabricante.vacinas ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vacinaService
      .query()
      .pipe(map((res: HttpResponse<IVacina[]>) => res.body ?? []))
      .pipe(
        map((vacinas: IVacina[]) =>
          this.vacinaService.addVacinaToCollectionIfMissing(vacinas, ...(this.editForm.get('vacinas')!.value ?? []))
        )
      )
      .subscribe((vacinas: IVacina[]) => (this.vacinasSharedCollection = vacinas));
  }

  protected createFromForm(): IFabricante {
    return {
      ...new Fabricante(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      criado: this.editForm.get(['criado'])!.value ? dayjs(this.editForm.get(['criado'])!.value, DATE_TIME_FORMAT) : undefined,
      vacinas: this.editForm.get(['vacinas'])!.value,
    };
  }
}
