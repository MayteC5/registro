import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegistroVacinacao } from '../registro-vacinacao.model';

@Component({
  selector: 'jhi-registro-vacinacao-detail',
  templateUrl: './registro-vacinacao-detail.component.html',
})
export class RegistroVacinacaoDetailComponent implements OnInit {
  registroVacinacao: IRegistroVacinacao | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroVacinacao }) => {
      this.registroVacinacao = registroVacinacao;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
