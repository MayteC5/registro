import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRegistroVacinacao, RegistroVacinacao } from '../registro-vacinacao.model';
import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';
import { FabricanteService } from 'app/entities/fabricante/service/fabricante.service';

@Component({
  selector: 'jhi-registro-vacinacao-update',
  templateUrl: './registro-vacinacao-update.component.html',
})
export class RegistroVacinacaoUpdateComponent implements OnInit {
  isSaving = false;

  pessoasSharedCollection: IPessoa[] = [];
  vacinasSharedCollection: IVacina[] = [];
  fabricantesSharedCollection: IFabricante[] = [];

  editForm = this.fb.group({
    id: [],
    dia: [],
    cns: [],
    enfermeiro: [],
    pessoa: [],
    vacina: [],
    fabricante: [],
  });

  constructor(
    protected registroVacinacaoService: RegistroVacinacaoService,
    protected pessoaService: PessoaService,
    protected vacinaService: VacinaService,
    protected fabricanteService: FabricanteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroVacinacao }) => {
      this.updateForm(registroVacinacao);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const registroVacinacao = this.createFromForm();
    if (registroVacinacao.id !== undefined) {
      this.subscribeToSaveResponse(this.registroVacinacaoService.update(registroVacinacao));
    } else {
      this.subscribeToSaveResponse(this.registroVacinacaoService.create(registroVacinacao));
    }
  }

  trackPessoaById(index: number, item: IPessoa): number {
    return item.id!;
  }

  trackVacinaById(index: number, item: IVacina): number {
    return item.id!;
  }

  trackFabricanteById(index: number, item: IFabricante): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistroVacinacao>>): void {
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

  protected updateForm(registroVacinacao: IRegistroVacinacao): void {
    this.editForm.patchValue({
      id: registroVacinacao.id,
      dia: registroVacinacao.dia,
      cns: registroVacinacao.cns,
      enfermeiro: registroVacinacao.enfermeiro,
      pessoa: registroVacinacao.pessoa,
      vacina: registroVacinacao.vacina,
      fabricante: registroVacinacao.fabricante,
    });

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing(
      this.pessoasSharedCollection,
      registroVacinacao.pessoa
    );
    this.vacinasSharedCollection = this.vacinaService.addVacinaToCollectionIfMissing(
      this.vacinasSharedCollection,
      registroVacinacao.vacina
    );
    this.fabricantesSharedCollection = this.fabricanteService.addFabricanteToCollectionIfMissing(
      this.fabricantesSharedCollection,
      registroVacinacao.fabricante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing(pessoas, this.editForm.get('pessoa')!.value)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));

    this.vacinaService
      .query()
      .pipe(map((res: HttpResponse<IVacina[]>) => res.body ?? []))
      .pipe(map((vacinas: IVacina[]) => this.vacinaService.addVacinaToCollectionIfMissing(vacinas, this.editForm.get('vacina')!.value)))
      .subscribe((vacinas: IVacina[]) => (this.vacinasSharedCollection = vacinas));

    this.fabricanteService
      .query()
      .pipe(map((res: HttpResponse<IFabricante[]>) => res.body ?? []))
      .pipe(
        map((fabricantes: IFabricante[]) =>
          this.fabricanteService.addFabricanteToCollectionIfMissing(fabricantes, this.editForm.get('fabricante')!.value)
        )
      )
      .subscribe((fabricantes: IFabricante[]) => (this.fabricantesSharedCollection = fabricantes));
  }

  protected createFromForm(): IRegistroVacinacao {
    return {
      ...new RegistroVacinacao(),
      id: this.editForm.get(['id'])!.value,
      dia: this.editForm.get(['dia'])!.value,
      cns: this.editForm.get(['cns'])!.value,
      enfermeiro: this.editForm.get(['enfermeiro'])!.value,
      pessoa: this.editForm.get(['pessoa'])!.value,
      vacina: this.editForm.get(['vacina'])!.value,
      fabricante: this.editForm.get(['fabricante'])!.value,
    };
  }
}
