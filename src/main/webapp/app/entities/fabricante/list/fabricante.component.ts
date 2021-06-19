import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFabricante } from '../fabricante.model';
import { FabricanteService } from '../service/fabricante.service';
import { FabricanteDeleteDialogComponent } from '../delete/fabricante-delete-dialog.component';

@Component({
  selector: 'jhi-fabricante',
  templateUrl: './fabricante.component.html',
})
export class FabricanteComponent implements OnInit {
  fabricantes?: IFabricante[];
  isLoading = false;

  constructor(protected fabricanteService: FabricanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fabricanteService.query().subscribe(
      (res: HttpResponse<IFabricante[]>) => {
        this.isLoading = false;
        this.fabricantes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFabricante): number {
    return item.id!;
  }

  delete(fabricante: IFabricante): void {
    const modalRef = this.modalService.open(FabricanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fabricante = fabricante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
