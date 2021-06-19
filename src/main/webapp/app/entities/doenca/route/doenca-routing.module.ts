import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DoencaComponent } from '../list/doenca.component';
import { DoencaDetailComponent } from '../detail/doenca-detail.component';
import { DoencaUpdateComponent } from '../update/doenca-update.component';
import { DoencaRoutingResolveService } from './doenca-routing-resolve.service';

const doencaRoute: Routes = [
  {
    path: '',
    component: DoencaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DoencaDetailComponent,
    resolve: {
      doenca: DoencaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DoencaUpdateComponent,
    resolve: {
      doenca: DoencaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DoencaUpdateComponent,
    resolve: {
      doenca: DoencaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(doencaRoute)],
  exports: [RouterModule],
})
export class DoencaRoutingModule {}
