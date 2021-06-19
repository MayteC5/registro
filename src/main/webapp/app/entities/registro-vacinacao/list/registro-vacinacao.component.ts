import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistroVacinacao } from '../registro-vacinacao.model';
import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';
import { RegistroVacinacaoDeleteDialogComponent } from '../delete/registro-vacinacao-delete-dialog.component';

@Component({
  selector: 'jhi-registro-vacinacao',
  templateUrl: './registro-vacinacao.component.html',
})
export class RegistroVacinacaoComponent implements OnInit {
  registroVacinacaos?: IRegistroVacinacao[];
  isLoading = false;

  constructor(protected registroVacinacaoService: RegistroVacinacaoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.registroVacinacaoService.query().subscribe(
      (res: HttpResponse<IRegistroVacinacao[]>) => {
        this.isLoading = false;
        this.registroVacinacaos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRegistroVacinacao): number {
    return item.id!;
  }

  delete(registroVacinacao: IRegistroVacinacao): void {
    const modalRef = this.modalService.open(RegistroVacinacaoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.registroVacinacao = registroVacinacao;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
