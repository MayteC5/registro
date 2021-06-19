import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RegistroVacinacaoComponent } from './list/registro-vacinacao.component';
import { RegistroVacinacaoDetailComponent } from './detail/registro-vacinacao-detail.component';
import { RegistroVacinacaoUpdateComponent } from './update/registro-vacinacao-update.component';
import { RegistroVacinacaoDeleteDialogComponent } from './delete/registro-vacinacao-delete-dialog.component';
import { RegistroVacinacaoRoutingModule } from './route/registro-vacinacao-routing.module';

@NgModule({
  imports: [SharedModule, RegistroVacinacaoRoutingModule],
  declarations: [
    RegistroVacinacaoComponent,
    RegistroVacinacaoDetailComponent,
    RegistroVacinacaoUpdateComponent,
    RegistroVacinacaoDeleteDialogComponent,
  ],
  entryComponents: [RegistroVacinacaoDeleteDialogComponent],
})
export class RegistroVacinacaoModule {}
