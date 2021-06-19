import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';

@Component({
  templateUrl: './doenca-delete-dialog.component.html',
})
export class DoencaDeleteDialogComponent {
  doenca?: IDoenca;

  constructor(protected doencaService: DoencaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.doencaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
