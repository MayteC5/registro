import * as dayjs from 'dayjs';

export interface IDoenca {
  id?: number;
  nome?: string | null;
  primeirocaso?: dayjs.Dayjs | null;
}

export class Doenca implements IDoenca {
  constructor(public id?: number, public nome?: string | null, public primeirocaso?: dayjs.Dayjs | null) {}
}

export function getDoencaIdentifier(doenca: IDoenca): number | undefined {
  return doenca.id;
}
