import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDoenca, Doenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';

@Component({
  selector: 'jhi-doenca-update',
  templateUrl: './doenca-update.component.html',
})
export class DoencaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
    primeirocaso: [],
  });

  constructor(protected doencaService: DoencaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ doenca }) => {
      this.updateForm(doenca);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const doenca = this.createFromForm();
    if (doenca.id !== undefined) {
      this.subscribeToSaveResponse(this.doencaService.update(doenca));
    } else {
      this.subscribeToSaveResponse(this.doencaService.create(doenca));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDoenca>>): void {
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

  protected updateForm(doenca: IDoenca): void {
    this.editForm.patchValue({
      id: doenca.id,
      nome: doenca.nome,
      primeirocaso: doenca.primeirocaso,
    });
  }

  protected createFromForm(): IDoenca {
    return {
      ...new Doenca(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      primeirocaso: this.editForm.get(['primeirocaso'])!.value,
    };
  }
}
