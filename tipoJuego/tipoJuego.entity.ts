import crypto from 'node:crypto'

export class TipoJuego{
  constructor(
    public name: string,
    public description: string,
    public id = crypto.randomUUID()
  ){}

}