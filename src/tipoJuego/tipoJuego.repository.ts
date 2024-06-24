import { Repository } from '../shared/repository.js'
import { TipoJuego } from './tipoJuego.entity.js'
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'
import { after } from 'node:test'

const tipoJuego = db.collection<TipoJuego>('tipoJuego')

export class tipoJuegoRepository implements Repository<TipoJuego> {
  public async findAll(): Promise<TipoJuego[] | undefined> {
    return await tipoJuego.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<TipoJuego| undefined> {
    const _id = new ObjectId(item.id)
    return (await tipoJuego.findOne({_id})) || undefined
  }

  public async add(item: TipoJuego): Promise<TipoJuego | undefined> {
    item._id = (await tipoJuego.insertOne(item)).insertedId
    return item
  }

  public async update(id: string, item: TipoJuego): Promise<TipoJuego | undefined> {
    const _id = new ObjectId(id)
    return (await tipoJuego.findOneAndUpdate({_id},{$set:item},{returnDocument:'after'})) || undefined
  }

  public async delete(item: { id: string }):  Promise<TipoJuego | undefined> {
    const _id = new ObjectId(item.id)
    return (await tipoJuego.findOneAndDelete({_id})) || undefined 
  }
}