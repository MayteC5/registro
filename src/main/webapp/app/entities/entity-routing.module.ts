import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'fabricante',
        data: { pageTitle: 'Fabricantes' },
        loadChildren: () => import('./fabricante/fabricante.module').then(m => m.FabricanteModule),
      },
      {
        path: 'pessoa',
        data: { pageTitle: 'Pessoas' },
        loadChildren: () => import('./pessoa/pessoa.module').then(m => m.PessoaModule),
      },
      {
        path: 'vacina',
        data: { pageTitle: 'Vacinas' },
        loadChildren: () => import('./vacina/vacina.module').then(m => m.VacinaModule),
      },
      {
        path: 'registro-vacinacao',
        data: { pageTitle: 'RegistroVacinacaos' },
        loadChildren: () => import('./registro-vacinacao/registro-vacinacao.module').then(m => m.RegistroVacinacaoModule),
      },
      {
        path: 'doenca',
        data: { pageTitle: 'Doencas' },
        loadChildren: () => import('./doenca/doenca.module').then(m => m.DoencaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
