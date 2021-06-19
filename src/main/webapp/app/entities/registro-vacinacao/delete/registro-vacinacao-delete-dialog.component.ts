import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistroVacinacao } from '../registro-vacinacao.model';
import { RegistroVacinacaoService } from '../service/registro-vacinacao.service';

@Component({
  templateUrl: './registro-vacinacao-delete-dialog.component.html',
})
export class RegistroVacinacaoDeleteDialogComponent {
  registroVacinacao?: IRegistroVacinacao;

  constructor(protected registroVacinacaoService: RegistroVacinacaoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.registroVacinacaoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
