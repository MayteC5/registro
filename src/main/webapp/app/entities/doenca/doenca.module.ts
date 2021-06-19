import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DoencaComponent } from './list/doenca.component';
import { DoencaDetailComponent } from './detail/doenca-detail.component';
import { DoencaUpdateComponent } from './update/doenca-update.component';
import { DoencaDeleteDialogComponent } from './delete/doenca-delete-dialog.component';
import { DoencaRoutingModule } from './route/doenca-routing.module';

@NgModule({
  imports: [SharedModule, DoencaRoutingModule],
  declarations: [DoencaComponent, DoencaDetailComponent, DoencaUpdateComponent, DoencaDeleteDialogComponent],
  entryComponents: [DoencaDeleteDialogComponent],
})
export class DoencaModule {}
