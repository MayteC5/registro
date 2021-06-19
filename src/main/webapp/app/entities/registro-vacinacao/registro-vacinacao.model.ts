import * as dayjs from 'dayjs';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';

export interface IRegistroVacinacao {
  id?: number;
  dia?: dayjs.Dayjs | null;
  cns?: string | null;
  enfermeiro?: string | null;
  pessoa?: IPessoa | null;
  vacina?: IVacina | null;
  fabricante?: IFabricante | null;
}

export class RegistroVacinacao implements IRegistroVacinacao {
  constructor(
    public id?: number,
    public dia?: dayjs.Dayjs | null,
    public cns?: string | null,
    public enfermeiro?: string | null,
    public pessoa?: IPessoa | null,
    public vacina?: IVacina | null,
    public fabricante?: IFabricante | null
  ) {}
}

export function getRegistroVacinacaoIdentifier(registroVacinacao: IRegistroVacinacao): number | undefined {
  return registroVacinacao.id;
}
