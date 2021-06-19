import * as dayjs from 'dayjs';
import { IDoenca } from 'app/entities/doenca/doenca.model';
import { IFabricante } from 'app/entities/fabricante/fabricante.model';

export interface IVacina {
  id?: number;
  nome?: string | null;
  criada?: dayjs.Dayjs | null;
  doenca?: IDoenca | null;
  fbricantes?: IFabricante[] | null;
}

export class Vacina implements IVacina {
  constructor(
    public id?: number,
    public nome?: string | null,
    public criada?: dayjs.Dayjs | null,
    public doenca?: IDoenca | null,
    public fbricantes?: IFabricante[] | null
  ) {}
}

export function getVacinaIdentifier(vacina: IVacina): number | undefined {
  return vacina.id;
}
