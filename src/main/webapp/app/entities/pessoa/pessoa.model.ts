import * as dayjs from 'dayjs';
import { Alergia } from 'app/entities/enumerations/alergia.model';

export interface IPessoa {
  id?: number;
  nome?: string | null;
  datanascimento?: dayjs.Dayjs | null;
  alergia?: Alergia | null;
}

export class Pessoa implements IPessoa {
  constructor(
    public id?: number,
    public nome?: string | null,
    public datanascimento?: dayjs.Dayjs | null,
    public alergia?: Alergia | null
  ) {}
}

export function getPessoaIdentifier(pessoa: IPessoa): number | undefined {
  return pessoa.id;
}
