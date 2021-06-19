import * as dayjs from 'dayjs';
import { IVacina } from 'app/entities/vacina/vacina.model';

export interface IFabricante {
  id?: number;
  nome?: string | null;
  criado?: dayjs.Dayjs | null;
  vacinas?: IVacina[] | null;
}

export class Fabricante implements IFabricante {
  constructor(public id?: number, public nome?: string | null, public criado?: dayjs.Dayjs | null, public vacinas?: IVacina[] | null) {}
}

export function getFabricanteIdentifier(fabricante: IFabricante): number | undefined {
  return fabricante.id;
}
