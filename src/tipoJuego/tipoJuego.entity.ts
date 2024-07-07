import { ObjectId } from 'mongodb';

export class TipoJuego{
  constructor(
    public name: string,
    public description: string,
    public _id?: ObjectId
  ){}

}