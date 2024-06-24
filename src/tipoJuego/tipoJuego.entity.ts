import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class TipoJuego{
  constructor(
    public name: string,
    public description: string,
    public _id?: ObjectId
  ){}

}