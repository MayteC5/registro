import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegistroVacinacaoComponent } from '../list/registro-vacinacao.component';
import { RegistroVacinacaoDetailComponent } from '../detail/registro-vacinacao-detail.component';
import { RegistroVacinacaoUpdateComponent } from '../update/registro-vacinacao-update.component';
import { RegistroVacinacaoRoutingResolveService } from './registro-vacinacao-routing-resolve.service';

const registroVacinacaoRoute: Routes = [
  {
    path: '',
    component: RegistroVacinacaoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegistroVacinacaoDetailComponent,
    resolve: {
      registroVacinacao: RegistroVacinacaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegistroVacinacaoUpdateComponent,
    resolve: {
      registroVacinacao: RegistroVacinacaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegistroVacinacaoUpdateComponent,
    resolve: {
      registroVacinacao: RegistroVacinacaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(registroVacinacaoRoute)],
  exports: [RouterModule],
})
export class RegistroVacinacaoRoutingModule {}
