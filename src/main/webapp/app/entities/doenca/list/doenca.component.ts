import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoenca } from '../doenca.model';
import { DoencaService } from '../service/doenca.service';
import { DoencaDeleteDialogComponent } from '../delete/doenca-delete-dialog.component';

@Component({
  selector: 'jhi-doenca',
  templateUrl: './doenca.component.html',
})
export class DoencaComponent implements OnInit {
  doencas?: IDoenca[];
  isLoading = false;

  constructor(protected doencaService: DoencaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.doencaService.query().subscribe(
      (res: HttpResponse<IDoenca[]>) => {
        this.isLoading = false;
        this.doencas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDoenca): number {
    return item.id!;
  }

  delete(doenca: IDoenca): void {
    const modalRef = this.modalService.open(DoencaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.doenca = doenca;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
