import { Repository } from '../shared/repository.js'
import { Region } from './region.entity.js'
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const region = db.collection<Region>('region')

export class RegionRepository implements Repository<Region>{
  public async findAll(): Promise<Region[] | undefined>{
    return await region.find().toArray()
  }

  public async findOne(item: { id: string }): Promise<Region| undefined> {
    const _id = new ObjectId(item.id)
    return (await region.findOne({_id})) || undefined
  }

  public async add(item: Region): Promise<Region | undefined> {
    item._id = (await region.insertOne(item)).insertedId
    return item
  }

  public async update(id: string, item: Region): Promise<Region | undefined> {
    const _id = new ObjectId(id)
    return (await region.findOneAndUpdate({_id},{$set:item},{returnDocument:'after'})) || undefined
  }

  public async delete(item: { id: string }):  Promise<Region | undefined> {
    const _id = new ObjectId(item.id)
    return (await region.findOneAndDelete({_id})) || undefined 
  }
}
